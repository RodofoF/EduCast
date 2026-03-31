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

/**
 * @swagger
 * /content:
 *   post:
 *     tags:
 *       - Content
 *     summary: Cria um conteúdo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Aula de Matemática
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               category:
 *                 type: string
 *                 example: Educação
 *               theme:
 *                 type: string
 *                 example: Álgebra
 *               subtitle:
 *                 type: string
 *                 example: Introdução às equações
 *               content:
 *                 type: string
 *                 example: Conteúdo da aula
 *     responses:
 *       201:
 *         description: Conteúdo criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 *   get:
 *     tags:
 *       - Content
 *     summary: Lista todos os conteúdos
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *       500:
 *         description: Erro interno
 */
router.post('/', createContent);
router.get('/', getAllContent);

/**
 * @swagger
 * /content/{id}:
 *   get:
 *     tags:
 *       - Content
 *     summary: Busca conteúdo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conteúdo encontrado
 *       404:
 *         description: Conteúdo não encontrado
 *   put:
 *     tags:
 *       - Content
 *     summary: Atualiza conteúdo por ID
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
 *               title:
 *                 type: string
 *                 example: Aula de Matemática Update
 *               user_id:
 *                 type: integer
 *                 example: 1
 *               category:
 *                 type: string
 *                 example: Educação Update
 *               theme:
 *                 type: string
 *                 example: Álgebra Update
 *               subtitle:
 *                 type: string
 *                 example: Introdução às equações Update
 *               content:
 *                 type: string
 *                 example: Conteúdo da aula update
 *     responses:
 *       200:
 *         description: Conteúdo atualizado com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 *   delete:
 *     tags:
 *       - Content
 *     summary: Remove conteúdo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conteúdo removido com sucesso
 *       404:
 *         description: Conteúdo não encontrado
 */
router.get('/:id', getContentById);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;
