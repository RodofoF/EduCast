const router = require('express').Router();
const { authorizeAdmin, authorizeUserOrAdmin } = require('../middleware/authorization.middleware');
const authenticateToken = require('../middleware/auth.middleware');
const {
    createContent,
    getAllContent,
    getContentById,
    updateContent,
    deleteContent,
} = require('../controllers/content.controller');
router.post('/', createContent);
router.get('/', getAllContent);
router.get('/:id', getContentById);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;
