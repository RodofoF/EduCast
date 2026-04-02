/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@email.com.br
 *         password:
 *           type: string
 *           example: educastadmin
 *     AuthUserSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userGroups:
 *           type: array
 *           items:
 *             type: integer
 *           example: [1, 2]
 *         username:
 *           type: string
 *           example: admin
 *         email:
 *           type: string
 *           format: email
 *           example: admin@email.com.br
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/AuthUserSummary'
 */

module.exports = {};
