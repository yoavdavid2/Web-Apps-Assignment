const commentsModel = require("../models/comments_model");

async function createComment(req, res) {
  const { postId, author, content } = req.body;

  if (!postId || !author || !content) {
    return res
      .status(400)
      .json({ error: "postId, author, and content are required." });
  }

  try {
    const newComment = new commentsModel({ postId, author, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: "Error creating comment." });
  }
}

async function getComments(req, res) {
  try {
    const comments = await commentsModel.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving comments." });
  }
}

async function getCommentsByPost(req, res) {
  const { postId } = req.params;

  try {
    const postComments = await commentsModel.find({ postId });
    res.json(postComments);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving comments." });
  }
}

async function getCommentById(req, res) {
  const { id } = req.params;
  try {
    const comment = await commentsModel.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving comment." });
  }
}

async function updateComment(req, res) {
  const { id } = req.params;
  const { postId, author, content } = req.body;

  if (!postId || !author || !content) {
    return res
      .status(400)
      .json({ error: "postId, author, and content are required." });
  }

  try {
    const updatedComment = await commentsModel.findByIdAndUpdate(
      id,
      { postId, author, content },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: "Error updating comment." });
  }
}

async function deleteComment(req, res) {
  const { id } = req.params;

  try {
    const deletedComment = await commentsModel.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found." });
    }

    res.json(deletedComment);
  } catch (err) {
    res.status(500).json({ error: "Error deleting comment." });
  }
}

module.exports = {
  createComment,
  getComments,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
};
