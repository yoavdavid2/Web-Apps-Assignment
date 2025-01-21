const express = require('express');
const comment_router = require('./comments/router');
const app = express();

app.use(express.json());

app.use('/comment', comment_router);

module.exports = app;