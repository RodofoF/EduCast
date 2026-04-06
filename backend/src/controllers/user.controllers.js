const User = require('../models/users/user.model');
const UserGroup = require('../models/users/user.groups.model');


async function createUser(req, res) {
    try {
        const { username, email, password, userGroups } = req.body;

        if (!username || !email || !password || !userGroups) {
            return res.status(400).json({ error: 'Username, email, password, and user groups are required' });
        }

        const user = await User.create({ username, email, password });

       if (Array.isArray(userGroups) && userGroups.length > 0) {
            await Promise.all(
                    userGroups.map(async (groupId) => {
                        const normalizedGroupId = Number(groupId);
                        if (!Number.isInteger(normalizedGroupId) || normalizedGroupId < 1) {
                            return;
                        }

                        await UserGroup.create({ userId: user.id, groupId: normalizedGroupId });
                })
            );
        }

        const safeUser = await User.findByPk(user.id, {
            attributes: { exclude: ['password'] },
            include: [{ model: UserGroup, as: 'userGroups' }],
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
            include: [{ model: UserGroup, as: 'userGroups' }],
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
            include: [{ model: UserGroup, as: 'userGroups' }],
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
        const { username, email, password, userGroups } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.password = password || user.password;
        await user.save();

        // Atualizar grupos se forem enviados
        if (Array.isArray(userGroups)) {
            await UserGroup.destroy({ where: { userId: user.id } });
            if (userGroups.length > 0) {
                await Promise.all(
                    userGroups.map(async (groupId) => {
                        const normalizedGroupId = Number(groupId);
                        if (!Number.isInteger(normalizedGroupId) || normalizedGroupId < 1) {
                            return;
                        }

                        await UserGroup.create({ userId: user.id, groupId: normalizedGroupId });
                    })
                );
            }
        }

        const safeUser = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [{ model: UserGroup, as: 'userGroups' }],
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

        // Deletar os grupos do usuário primeiro
        await UserGroup.destroy({ where: { userId: id } });
        // Depois deletar o usuário
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
