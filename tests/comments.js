const app = require('../src/app');

import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Comment } from '../src/comments/model'
import { MONGO_URL} from '../server';


const generateToken = () => {
    return jwt.sign({ username: 'testuser' }, 'secretKey', { expiresIn: '1h' });
};


const token = `Bearer ${generateToken()}`;

describe('Comments API', () => {
    beforeAll(async () => {
        const dbUri = `${MONGO_URL}/commentsAPI_test`;
        await mongoose.connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterEach(async () => {
        await Comment.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('POST /comments - Create a new comment', async () => {
        const res = await request(app)
            .post('/comments')
            .set('Authorization', token)
            .send({
                postId: 1,
                author: 'John Doe',
                content: 'This is a test comment.',
            });
            
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.author).toBe('John Doe');
    });

    test('GET /comments - Retrieve all comments', async () => {
        const comment = new Comment({ postId: 1, author: 'Jane', content: 'Sample comment' });
        await comment.save();

        const res = await request(app)
            .get('/comments')
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].author).toBe('Jane');
    });

    test('GET /comments/:id - Retrieve a comment by ID', async () => {
        const comment = new Comment({ postId: 1, author: 'Jane', content: 'Sample comment' });
        await comment.save();

        const res = await request(app)
            .get(`/comments/${comment._id}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body.author).toBe('Jane');
    });

    test('PUT /comments/:id - Update a comment by ID', async () => {
        const comment = new Comment({ postId: 1, author: 'Jane', content: 'Old content' });
        await comment.save();

        const res = await request(app)
            .put(`/comments/${comment._id}`)
            .set('Authorization', token)
            .send({
                postId: 1,
                author: 'Jane Updated',
                content: 'Updated content',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.author).toBe('Jane Updated');
        expect(res.body.content).toBe('Updated content');
    });

    test('DELETE /comments/:id - Delete a comment by ID', async () => {
        const comment = new Comment({ postId: 1, author: 'Jane', content: 'Sample content' });
        await comment.save();

        const res = await request(app)
            .delete(`/comments/${comment._id}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body.author).toBe('Jane');
    });
});
