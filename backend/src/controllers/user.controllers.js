const User = require('../models/user.model');

async function createUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email and password are required' });
        }

        const user = await User.create({ username, email, password });
        const safeUser = await User.findByPk(user.id, {
            attributes: { exclude: ['password'] },
        });

        res.status(201).json(safeUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}

async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.password = password || user.password;
        await user.save();

        const safeUser = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
        });

        res.json(safeUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}

async function deleteUser(req, res) {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
