const { Comment } = require('./model');


export async function createComment(req, res) {
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
}

export async function getComments(req, res) {
    try {
        const comments = await Comment.find();
        res.json(comments);

    } catch (err) {
        res.status(500).json({ error: 'Error retrieving comments.' });
    }
}

export async function getCommentsByPost(req, res) {
    const { postId } = req.params;

    try {
        const postComments = await Comment.find({ postId });
        res.json(postComments);

    } catch (err) {
        res.status(500).json({ error: 'Error retrieving comments.' });
    }
}

export async function getCommentById(req, res) {
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
}

export async function updateComment(req, res) {
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
}

export async function deleteComment(req, res) {
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
}