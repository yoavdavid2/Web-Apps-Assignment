const express = require("express");
const router = express.Router();
const {
  createComment,
  getComments,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../controllers/comments_controller");

router.post("/", createComment);

router.get("/all", getComments);

router.get("/post/:postId", getCommentsByPost);

router.get("/:id", getCommentById);

router.put("/:id", updateComment);

router.delete("/:id", deleteComment);

module.exports = router;
