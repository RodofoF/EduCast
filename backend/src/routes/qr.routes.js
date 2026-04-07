const router = require('express').Router();
const {authorizeAdmin, authorizeUserOrAdmin} = require('../middleware/authorization.middleware');
const authenticateToken = require('../middleware/auth.middleware');
const {
  getQRCodeStatic,
  generateQRCode,
  getQRCodeStaticImage,
  generateQRCodeImage,
} = require('../controllers/qrcode.controllers');

router.get('/static', authenticateToken, authorizeUserOrAdmin, getQRCodeStatic);
router.get('/generate', authenticateToken, authorizeUserOrAdmin, generateQRCode);

// PNG escaneável
router.get('/static/image', authenticateToken, authorizeUserOrAdmin, getQRCodeStaticImage);
router.get('/generate/image', authenticateToken, authorizeUserOrAdmin, generateQRCodeImage);

module.exports = router;

// JSON:
// http://localhost:3000/api/qr/static
// http://localhost:3000/api/qr/generate?serverIp=192.168.4.77&apiPort=3000&streamPort=9090

// PNG:
// http://localhost:3000/api/qr/static/image
// http://localhost:3000/api/qr/generate/image?serverIp=192.168.4.77&apiPort=3000&streamPort=9090