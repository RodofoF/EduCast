const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsRoot = path.join(__dirname, '../../uploads');
const videoUploadDir = path.join(uploadsRoot, 'ondemand/videos');
const thumbnailUploadDir = path.join(uploadsRoot, 'ondemand/thumbnails');
const liveThumbnailUploadDir = path.join(uploadsRoot, 'live/thumbnails');

[uploadsRoot, videoUploadDir, thumbnailUploadDir, liveThumbnailUploadDir].forEach((directory) => {
	fs.mkdirSync(directory, { recursive: true });
});

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === 'video') {
			return cb(null, videoUploadDir);
		}

		if (file.fieldname === 'thumbnail') {
			return cb(null, thumbnailUploadDir);
		}

		return cb(new Error('Invalid upload field'));
	},
	filename: (req, file, cb) => {
		const extension = path.extname(file.originalname);
		const baseName = path
			.basename(file.originalname, extension)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');

		cb(null, `${Date.now()}-${baseName || 'file'}${extension.toLowerCase()}`);
	},
});

const fileFilter = (req, file, cb) => {
	if (file.fieldname === 'video') {
		if (file.mimetype.startsWith('video/')) {
			return cb(null, true);
		}

		return cb(new Error('Only video files are allowed for the video field'));
	}

	if (file.fieldname === 'thumbnail') {
		if (file.mimetype.startsWith('image/')) {
			return cb(null, true);
		}

		return cb(new Error('Only image files are allowed for the thumbnail field'));
	}

	return cb(new Error('Invalid upload field'));
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 500 * 1024 * 1024,
	},
});

const uploadOnDemandMedia = upload.fields([
	{ name: 'video', maxCount: 1 },
	{ name: 'thumbnail', maxCount: 1 },
]);

const liveStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === 'thumbnail') {
			return cb(null, liveThumbnailUploadDir);
		}

		return cb(new Error('Invalid upload field'));
	},
	filename: (req, file, cb) => {
		const extension = path.extname(file.originalname);
		const baseName = path
			.basename(file.originalname, extension)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');

		cb(null, `${Date.now()}-${baseName || 'file'}${extension.toLowerCase()}`);
	},
});

const liveFileFilter = (req, file, cb) => {
	if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
		return cb(null, true);
	}

	return cb(new Error('Only image files are allowed for the thumbnail field'));
};

const uploadLiveMedia = multer({
	storage: liveStorage,
	fileFilter: liveFileFilter,
	limits: {
		fileSize: 500 * 1024 * 1024,
	},
}).fields([{ name: 'thumbnail', maxCount: 1 }]);

module.exports = {
	uploadOnDemandMedia,
	uploadLiveMedia,
};
