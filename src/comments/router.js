const express = require('express');
const router = express.Router();
const { createComment, getComments, getCommentsByPost, getCommentById, updateComment, deleteComment } = require('./comments/controller');
const { authenticateToken } = require('../middlewares/auth');


router.post('/comments', authenticateToken, createComment);

router.get('/comments', authenticateToken, getComments);

router.get('/comments/post/:postId', authenticateToken, getCommentsByPost);

router.get('/comments/:id', authenticateToken, getCommentById);

router.put('/comments/:id', authenticateToken, updateComment);

router.delete('/comments/:id', authenticateToken, deleteComment);

module.exports = router;
