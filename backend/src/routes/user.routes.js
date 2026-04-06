const router = require('express').Router();
const {authorizeAdmin, authorizeUserOrAdmin} = require('../middleware/authorization.middleware');
const authenticateToken = require('../middleware/auth.middleware');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} = require('../controllers/user.controllers');
router.post('/', authenticateToken, authorizeAdmin, createUser);
router.get('/', authenticateToken, authorizeUserOrAdmin, getAllUsers);
router.get('/:id', authenticateToken, authorizeUserOrAdmin, getUserById);
router.put('/:id', authenticateToken, authorizeAdmin, updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

module.exports = router;
    