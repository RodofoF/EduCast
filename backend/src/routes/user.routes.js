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

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cria um usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - userGroups
 *             properties:
 *               username:
 *                 type: string
 *                 example: test
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *               userGroups:
 *                 type: array
 *                 description: IDs dos grupos do usuário (1=Admin, 2=Teacher, 3=Student, 4=School 1)
 *                 items:
 *                   type: integer
 *                 example: [2, 4]
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 *   get:
 *     tags:
 *       - Users
 *     summary: Lista todos os usuários
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *       500:
 *         description: Erro interno
 */
router.post('/', authenticateToken, authorizeAdmin, createUser);
router.get('/', authenticateToken, authorizeUserOrAdmin, getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Busca usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 *   put:
 *     tags:
 *       - Users
 *     summary: Atualiza usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: test_atualizado
 *               email:
 *                 type: string
 *                 format: email
 *                 example: test_atualizado@email.com
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *               userGroups:
 *                 type: array
 *                 description: IDs dos grupos do usuário (1=Admin, 2=Teacher, 3=Student, 4=School 1)
 *                 items:
 *                   type: integer
 *                 example: [3]
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 *   delete:
 *     tags:
 *       - Users
 *     summary: Remove usuário por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário removido
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authenticateToken, authorizeUserOrAdmin, getUserById);
router.put('/:id', authenticateToken, authorizeAdmin, updateUser);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

module.exports = router;
    