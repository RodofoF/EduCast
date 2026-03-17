const router = require('express').Router();
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
 *             properties:
 *               username:
 *                 type: string
 *                 example: rodolfo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rodolfo@email.com
 *               password:
 *                 type: string
 *                 example: senha123
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
router.post('/', createUser);
router.get('/', getAllUsers);

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
 *                 example: rodolfo_atualizado
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rodolfo_atualizado@email.com
 *               password:
 *                 type: string
 *                 example: novaSenha123
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
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
