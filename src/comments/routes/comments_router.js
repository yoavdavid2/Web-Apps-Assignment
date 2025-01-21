const express = require("express");
const router = express.Router();
const {
  createComment,
  getComments,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
} = require("./comments/controller");

router.post("/comments", createComment);

router.get("/comments", getComments);

router.get("/comments/post/:postId", getCommentsByPost);

router.get("/comments/:id", getCommentById);

router.put("/comments/:id", updateComment);

router.delete("/comments/:id", deleteComment);

module.exports = router;
