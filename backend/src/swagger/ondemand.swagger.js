/**
 * @swagger
 * tags:
 *   - name: OnDemand
 *     description: On-demand content endpoints
 */

/**
 * @swagger
 * /ondemand:
 *   post:
 *     summary: Create on-demand content
 *     tags: [OnDemand]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/OnDemandCreateRequest'
 *     responses:
 *       201:
 *         description: On-demand content created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnDemand'
 *       400:
 *         description: Title and video URL are required
 *       500:
 *         description: Failed to create on-demand content
 *   get:
 *     summary: List all on-demand content
 *     tags: [OnDemand]
 *     security: []
 *     responses:
 *       200:
 *         description: On-demand content returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OnDemand'
 *       500:
 *         description: Failed to fetch on-demand content
 */

/**
 * @swagger
 * /ondemand/{id}:
 *   get:
 *     summary: Get on-demand content by ID
 *     tags: [OnDemand]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: On-demand content found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnDemand'
 *       404:
 *         description: On-demand content not found
 *       500:
 *         description: Failed to fetch on-demand content
 *   put:
 *     summary: Update on-demand content by ID
 *     tags: [OnDemand]
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
 *             $ref: '#/components/schemas/OnDemandUpdateRequest'
 *     responses:
 *       200:
 *         description: On-demand content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnDemand'
 *       404:
 *         description: On-demand content not found
 *       500:
 *         description: Failed to update on-demand content
 *   delete:
 *     summary: Delete on-demand content by ID
 *     tags: [OnDemand]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: On-demand content deleted successfully
 *       404:
 *         description: On-demand content not found
 *       500:
 *         description: Failed to delete on-demand content
 */

module.exports = {};
