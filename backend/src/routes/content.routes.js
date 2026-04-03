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
router.post('/', authenticateToken, authorizeAdmin, createContent);
router.get('/', authenticateToken, authorizeUserOrAdmin, getAllContent);
router.get('/:id', authenticateToken, authorizeUserOrAdmin, getContentById);
router.put('/:id', authenticateToken, authorizeAdmin, updateContent);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteContent);

module.exports = router;
