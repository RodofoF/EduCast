/**
 * @swagger
 * components:
 *   schemas:
 *     QRCodeConfigPayload:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: EDUCAST_CONFIG
 *         serverIp:
 *           type: string
 *           example: 192.168.4.51
 *         apiPort:
 *           type: integer
 *           example: 3000
 *         streamPort:
 *           type: integer
 *           example: 9090
 *         version:
 *           type: integer
 *           example: 1
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           example: 2026-04-07T23:59:59.000Z
 */

module.exports = {};
