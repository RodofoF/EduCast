/**
 * @swagger
 * components:
 *   schemas:
 *     UserGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         userId:
 *           type: integer
 *           example: 1
 *         groupId:
 *           type: integer
 *           example: 2
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: test
 *         email:
 *           type: string
 *           format: email
 *           example: test@email.com
 *         userGroups:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserGroup'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserCreateRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - userGroups
 *       properties:
 *         username:
 *           type: string
 *           example: test
 *         email:
 *           type: string
 *           format: email
 *           example: test@email.com
 *         password:
 *           type: string
 *           example: senha123
 *         userGroups:
 *           type: array
 *           description: Group IDs for the user
 *           items:
 *             type: integer
 *           example: [2, 4]
 *     UserUpdateRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: test_updated
 *         email:
 *           type: string
 *           format: email
 *           example: test_updated@email.com
 *         password:
 *           type: string
 *           example: novaSenha123
 *         userGroups:
 *           type: array
 *           description: Group IDs for the user
 *           items:
 *             type: integer
 *           example: [3]
 */

module.exports = {};
