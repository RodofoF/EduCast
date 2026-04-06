const router = require('express').Router();
const {
	createLive,
	getAllLives,
	getLiveById,
	updateLive,
	deleteLive,
} = require('../controllers/live.controller');
const { uploadLiveMedia } = require('../middleware/upload.middleware');

router.post('/', uploadLiveMedia, createLive);
router.get('/', getAllLives);
router.get('/:id', getLiveById);
router.put('/:id', uploadLiveMedia, updateLive);
router.delete('/:id', deleteLive);

module.exports = router;
