const router = require('express').Router();
const {
	createOnDemand,
	getAllOnDemands,
	getOnDemandById,
	updateOnDemand,
	deleteOnDemand,
} = require('../controllers/ondemand.controller');
const { uploadOnDemandMedia } = require('../middleware/upload.middleware');

router.post('/', uploadOnDemandMedia, createOnDemand);
router.get('/', getAllOnDemands);
router.get('/:id', getOnDemandById);
router.put('/:id', uploadOnDemandMedia, updateOnDemand);
router.delete('/:id', deleteOnDemand);

module.exports = router;
