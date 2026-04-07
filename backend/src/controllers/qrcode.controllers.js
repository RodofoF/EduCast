const QRCode = require('qrcode');

function toValidPort(value, fallback) {
    const port = Number(value);
    return Number.isInteger(port) && port > 0 && port <= 65535 ? port : fallback;
}

function buildPayload(query = {}) {
    const defaultServerIp = process.env.QR_SERVER_IP || process.env.SWAGGER_HOST || '192.168.4.51';
    const defaultApiPort = toValidPort(process.env.QR_API_PORT || process.env.PORT, 3000);
    const defaultStreamPort = toValidPort(process.env.QR_STREAM_PORT, 9090);

    return {
        type: 'EDUCAST_CONFIG',
        serverIp: query.serverIp || defaultServerIp,
        apiPort: toValidPort(query.apiPort, defaultApiPort),
        streamPort: toValidPort(query.streamPort, defaultStreamPort),
        version: 1,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    };
}

async function sendQRCodeImage(res, payload) {
    const png = await QRCode.toBuffer(JSON.stringify(payload), {
        type: 'png',
        width: 360,
        margin: 1,
        errorCorrectionLevel: 'M',
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.send(png);
}

const getQRCodeStatic = (req, res) => {
    res.json(buildPayload());
};

const generateQRCode = (req, res) => {
    res.json(buildPayload(req.query));
};

const getQRCodeStaticImage = async (req, res, next) => {
    try {
        await sendQRCodeImage(res, buildPayload());
    } catch (error) {
        next(error);
    }
};

const generateQRCodeImage = async (req, res, next) => {
    try {
        await sendQRCodeImage(res, buildPayload(req.query));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getQRCodeStatic,
    generateQRCode,
    getQRCodeStaticImage,
    generateQRCodeImage,
};