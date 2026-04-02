/**
 * @swagger
 * components:
 *   schemas:
 *     OnDemand:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Aula Gravada 01
 *         subtitle:
 *           type: string
 *           example: Introducao
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
 *           example: Conteudo on-demand para alunos
 *         thumbnail_url:
 *           type: string
 *           example: /uploads/ondemand/thumbnails/thumb-1.jpg
 *         video_url:
 *           type: string
 *           example: /uploads/ondemand/videos/video-1.mp4
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OnDemandCreateRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           example: Aula Gravada 01
 *         subtitle:
 *           type: string
 *           example: Introducao
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
 *           example: Conteudo on-demand para alunos
 *         thumbnail_url:
 *           type: string
 *           example: https://cdn.exemplo.com/thumb.jpg
 *         video_url:
 *           type: string
 *           example: https://cdn.exemplo.com/video.mp4
 *         thumbnail:
 *           type: string
 *           format: binary
 *         video:
 *           type: string
 *           format: binary
 *     OnDemandUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: Aula Gravada 01 Atualizada
 *         subtitle:
 *           type: string
 *           example: Introducao Atualizada
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
 *           example: Conteudo on-demand atualizado
 *         thumbnail_url:
 *           type: string
 *           example: https://cdn.exemplo.com/thumb-update.jpg
 *         video_url:
 *           type: string
 *           example: https://cdn.exemplo.com/video-update.mp4
 *         thumbnail:
 *           type: string
 *           format: binary
 *         video:
 *           type: string
 *           format: binary
 */

module.exports = {};
