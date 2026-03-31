const express = require('express');
const { login } = require('../controllers/auth.controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@email.com.br
 *               password:
 *                 type: string
 *                 example: educastadmin
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro interno
 */
router.post('/login', login);

module.exports = router;