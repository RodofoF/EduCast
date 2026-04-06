/**
 * @swagger
 * components:
 *   schemas:
 *     Content:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Aula de Matematica
 *         user_id:
 *           type: integer
 *           example: 1
 *         category:
 *           type: string
 *           example: Educacao
 *         theme:
 *           type: string
 *           example: Algebra
 *         subtitle:
 *           type: string
 *           example: Introducao as equacoes
 *         content:
 *           type: string
 *           example: Conteudo da aula
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ContentCreateRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           example: Aula de Matematica
 *         user_id:
 *           type: integer
 *           example: 1
 *         category:
 *           type: string
 *           example: Educacao
 *         theme:
 *           type: string
 *           example: Algebra
 *         subtitle:
 *           type: string
 *           example: Introducao as equacoes
 *         content:
 *           type: string
 *           example: Conteudo da aula
 *     ContentUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Aula de Matematica Update
 *         user_id:
 *           type: integer
 *           example: 1
 *         category:
 *           type: string
 *           example: Educacao Update
 *         theme:
 *           type: string
 *           example: Algebra Update
 *         subtitle:
 *           type: string
 *           example: Introducao as equacoes Update
 *         content:
 *           type: string
 *           example: Conteudo da aula update
 */

module.exports = {};
