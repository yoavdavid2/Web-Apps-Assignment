const express = require('express');
const comment_router = require('./comments/router');
const app = express();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Comments API',
            version: '1.0.0',
            description: 'API for managing comments',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./**/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.use('/comment', comment_router);

module.exports = app;