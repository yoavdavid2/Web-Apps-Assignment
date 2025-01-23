const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
