const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Gateway Speedcast IoT Station API',
        version: '1.0.0',
        description: 'API documentation for the Gateway Speedcast IoT Station project',
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
            url: 'http://192.168.111.229:3000/api',
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