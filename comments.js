import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

const app = express();
app.use(express.json());

const MONGO_URL = 'mongodb://localhost:27017'


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


mongoose.connect(`${MONGO_URL}/commentsAPI`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('Could not connect to MongoDB', err));


const commentSchema = new mongoose.Schema({
    postId: { type: Number, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
});

const Comment = mongoose.model('Comment', commentSchema);


const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token required.' });

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });

        req.user = user;
        next();
    });
};


/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - postId
 *         - author
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the comment
 *         postId:
 *           type: number
 *           description: ID of the post associated with the comment
 *         author:
 *           type: string
 *           description: Author of the comment
 *         content:
 *           type: string
 *           description: Content of the comment
 */


/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       201:
 *         description: Comment created successfully
 */
app.post('/comments', authenticateToken, async (req, res) => {
    const { postId, author, content } = req.body;

    if (!postId || !author || !content) {
        return res.status(400).json({ error: 'postId, author, and content are required.' });
    }

    try {
        const newComment = new Comment({ postId, author, content });
        await newComment.save();
        res.status(201).json(newComment);

    } catch (err) {
        res.status(500).json({ error: 'Error creating comment.' });
    }
});


/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: List of all comments
 */
app.get('/comments', authenticateToken, async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);

    } catch (err) {
        res.status(500).json({ error: 'Error retrieving comments.' });
    }
});


/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: number
 *         required: true
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Comments for the specified post
 */
app.get('/comments/post/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;

    try {
        const postComments = await Comment.find({ postId });
        res.json(postComments);

    } catch (err) {
        res.status(500).json({ error: 'Error retrieving comments.' });
    }
});


/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 */
app.get('/comments/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        res.json(comment);

    } catch (err) {
        res.status(500).json({ error: 'Error retrieving comment.' });
    }
});


/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 */
app.put('/comments/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { postId, author, content } = req.body;

    if (!postId || !author || !content) {
        return res.status(400).json({ error: 'postId, author, and content are required.' });
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { postId, author, content },
            { new: true, runValidators: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        res.json(updatedComment);

    } catch (err) {
        res.status(500).json({ error: 'Error updating comment.' });
    }
});


/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
app.delete('/comments/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedComment = await Comment.findByIdAndDelete(id);

        if (!deletedComment) {
            return res.status(404).json({ error: 'Comment not found.' });
        }

        res.json(deletedComment);

    } catch (err) {
        res.status(500).json({ error: 'Error deleting comment.' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});