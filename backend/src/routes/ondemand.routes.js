const router = require('express').Router();
const { authorizeAdmin, authorizeUserOrAdmin } = require('../middleware/authorization.middleware');
const authenticateToken = require('../middleware/auth.middleware');
const {
	createOnDemand,
	getAllOnDemands,
	getOnDemandById,
	updateOnDemand,
	deleteOnDemand,
} = require('../controllers/ondemand.controller');
const { uploadOnDemandMedia } = require('../middleware/upload.middleware');

router.post('/', authenticateToken, authorizeAdmin, uploadOnDemandMedia, createOnDemand);
router.get('/', authenticateToken, authorizeUserOrAdmin, getAllOnDemands);
router.get('/:id', authenticateToken, authorizeUserOrAdmin, getOnDemandById);
router.put('/:id', authenticateToken, authorizeAdmin, uploadOnDemandMedia, updateOnDemand);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteOnDemand);

module.exports = router;
