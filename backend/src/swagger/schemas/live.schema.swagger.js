/**
 * @swagger
 * components:
 *   schemas:
 *     Live:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Aula ao Vivo 01
 *         subtitle:
 *           type: string
 *           example: Edicao especial
 *         category:
 *           type: string
 *           example: Educacao
 *         theme:
 *           type: string
 *           example: Algebra
 *         user_id:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: Transmissao ao vivo para alunos
 *         thumbnail_url:
 *           type: string
 *           example: /uploads/live/thumbnails/thumb-1.jpg
 *         video_url:
 *           type: string
 *           example: rtmp://stream.exemplo.com/live/canal-1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     LiveCreateRequest:
 *       type: object
 *       required:
 *         - title
 *         - video_url
 *       properties:
 *         title:
 *           type: string
 *           example: Aula ao Vivo 01
 *         subtitle:
 *           type: string
 *           example: Edicao especial
 *         category:
 *           type: string
 *           example: Educacao
 *         theme:
 *           type: string
 *           example: Algebra
 *         user_id:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: Transmissao ao vivo para alunos
 *         thumbnail_url:
 *           type: string
 *           example: https://cdn.exemplo.com/live-thumb.jpg
 *         video_url:
 *           type: string
 *           example: rtmp://stream.exemplo.com/live/canal-1
 *         thumbnail:
 *           type: string
 *           format: binary
 *     LiveUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Aula ao Vivo 01 Atualizada
 *         subtitle:
 *           type: string
 *           example: Edicao especial atualizada
 *         category:
 *           type: string
 *           example: Educacao
 *         theme:
 *           type: string
 *           example: Algebra
 *         user_id:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: Transmissao ao vivo atualizada
 *         thumbnail_url:
 *           type: string
 *           example: https://cdn.exemplo.com/live-thumb-update.jpg
 *         video_url:
 *           type: string
 *           example: rtmp://stream.exemplo.com/live/canal-1-update
 *         thumbnail:
 *           type: string
 *           format: binary
 */

module.exports = {};
