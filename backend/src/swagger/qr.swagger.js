/**
 * @swagger
 * tags:
 *   - name: QRCode
 *     description: QR code configuration endpoints
 */

/**
 * @swagger
 * /qr/static:
 *   get:
 *     summary: Get static QR configuration payload (JSON)
 *     tags: [QRCode]
 *     security: []
 *     responses:
 *       200:
 *         description: Static QR configuration payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QRCodeConfigPayload'
 */

/**
 * @swagger
 * /qr/generate:
 *   get:
 *     summary: Get dynamic QR configuration payload (JSON)
 *     tags: [QRCode]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: serverIp
 *         required: false
 *         schema:
 *           type: string
 *         description: IP address used by the mobile app to reach backend/stream source
 *         example: 192.168.4.77
 *       - in: query
 *         name: apiPort
 *         required: false
 *         schema:
 *           type: integer
 *         description: Backend API port
 *         example: 3000
 *       - in: query
 *         name: streamPort
 *         required: false
 *         schema:
 *           type: integer
 *         description: Streaming/on-demand port
 *         example: 9090
 *     responses:
 *       200:
 *         description: Dynamic QR configuration payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/QRCodeConfigPayload'
 */

/**
 * @swagger
 * /qr/static/image:
 *   get:
 *     summary: Get static QR code image (PNG)
 *     tags: [QRCode]
 *     security: []
 *     responses:
 *       200:
 *         description: Static QR code image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /qr/generate/image:
 *   get:
 *     summary: Get dynamic QR code image (PNG)
 *     tags: [QRCode]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: serverIp
 *         required: false
 *         schema:
 *           type: string
 *         description: IP address used by the mobile app to reach backend/stream source
 *         example: 192.168.4.77
 *       - in: query
 *         name: apiPort
 *         required: false
 *         schema:
 *           type: integer
 *         description: Backend API port
 *         example: 3000
 *       - in: query
 *         name: streamPort
 *         required: false
 *         schema:
 *           type: integer
 *         description: Streaming/on-demand port
 *         example: 9090
 *     responses:
 *       200:
 *         description: Dynamic QR code image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */

module.exports = {};
