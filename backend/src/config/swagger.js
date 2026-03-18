const swaggerJsdoc = require('swagger-jsdoc');

const swaggerHost = process.env.SWAGGER_HOST || 'localhost';
const swaggerProtocol = process.env.SWAGGER_PROTOCOL || 'http';
const swaggerPort = process.env.SWAGGER_PORT || process.env.PORT || '3000';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'EduCast API Documentation',
        version: '1.0.0',
        description: 'API documentation for the EduCast project',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    servers: [
        {
            url: `${swaggerProtocol}://${swaggerHost}:${swaggerPort}/api`,
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;