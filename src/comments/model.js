import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    postId: { type: Number, required: true },
    author: { type: String, required: true },
    content: { type: String, required: true },
});

const Comment = mongoose.model('Comment', commentSchema);