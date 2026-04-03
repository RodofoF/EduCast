const router = require('express').Router();
const { authorizeAdmin, authorizeUserOrAdmin } = require('../middleware/authorization.middleware');
const authenticateToken = require('../middleware/auth.middleware');
const {
	createLive,
	getAllLives,
	getLiveById,
	updateLive,
	deleteLive,
} = require('../controllers/live.controller');
const { uploadLiveMedia } = require('../middleware/upload.middleware');

router.post('/', authenticateToken,authorizeAdmin, uploadLiveMedia, createLive);
router.get('/', authenticateToken, authorizeUserOrAdmin, getAllLives);
router.get('/:id', authenticateToken, authorizeUserOrAdmin, getLiveById);
router.put('/:id', authenticateToken,authorizeAdmin, uploadLiveMedia, updateLive);
router.delete('/:id', authenticateToken,authorizeAdmin, deleteLive);

module.exports = router;
