const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users/user.model');
const UserGroup = require('../models/users/user.groups.model');

async function login(req, res) {
  const { email, password } = req.body;


  try {
    // Verifique se o usuário existe
    const user = await User.findOne({
      where: { email },
      include: [{ model: UserGroup, as: 'userGroups', attributes: ['groupId'] }],
    });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    // Verifique a senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const userGroups = (user.userGroups || []).map(ug => ug.groupId);

    // Gere o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, userGroups },
      process.env.JWT_SECRET, // Certifique-se de definir JWT_SECRET no .env
      { expiresIn: '6h' } // Token expira em 6 hora
    );

    // Monte os dados do usuário (sem a senha)
    const userData = {
      id: user.id,
      userGroups,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
}

module.exports = { login };