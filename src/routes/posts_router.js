const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getAllPostsBySender,
  getPostById,
  updatePost,
} = require("../controllers/posts_controller");

router.post("/", createPost);

router.get("/", getAllPosts);

router.get("/post", getAllPostsBySender);

router.get("/:id", getPostById);

router.put("/:id", updatePost);

module.exports = router;
