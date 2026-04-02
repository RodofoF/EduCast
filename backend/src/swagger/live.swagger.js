/**
 * @swagger
 * tags:
 *   - name: Live
 *     description: Live content endpoints
 */

/**
 * @swagger
 * /live:
 *   post:
 *     summary: Create live content
 *     tags: [Live]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/LiveCreateRequest'
 *     responses:
 *       201:
 *         description: Live content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Live'
 *       400:
 *         description: Title and video URL are required
 *       500:
 *         description: Failed to create live content
 *   get:
 *     summary: List all live content
 *     tags: [Live]
 *     security: []
 *     responses:
 *       200:
 *         description: Live content returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Live'
 *       500:
 *         description: Failed to fetch live content
 */

/**
 * @swagger
 * /live/{id}:
 *   get:
 *     summary: Get live content by ID
 *     tags: [Live]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Live content found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Live'
 *       404:
 *         description: Live content not found
 *       500:
 *         description: Failed to fetch live content
 *   put:
 *     summary: Update live content by ID
 *     tags: [Live]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/LiveUpdateRequest'
 *     responses:
 *       200:
 *         description: Live content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Live'
 *       404:
 *         description: Live content not found
 *       500:
 *         description: Failed to update live content
 *   delete:
 *     summary: Delete live content by ID
 *     tags: [Live]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Live content deleted successfully
 *       404:
 *         description: Live content not found
 *       500:
 *         description: Failed to delete live content
 */

module.exports = {};
