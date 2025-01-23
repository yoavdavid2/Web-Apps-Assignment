const postModel = require("../models/posts_model");

const createPost = async (req, res) => {
  const { title, content, sender } = req.body;
  console.log(req.body);

  if (!title || !sender) {
    return res
      .status(400)
      .json({ error: "title and sender are required for this route" });
  }
  try {
    const post = await postModel.create({ title, sender, content });
    res.status(201).send(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find();
    res.json(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getAllPostsBySender = async (req, res) => {
  const { sender } = req.query;
  console.log(sender);

  if (!sender) {
    return res.status(400).json({ error: "sender is required for this route" });
  }

  try {
    const posts = await postModel.find({ sender: sender });
    res.send(posts);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findById(id);

    if (!post) {
      res.status(404).send("Post not found");
    }

    res.send(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const post = await postModel.findByIdAndUpdate(
      id,
      { content: content },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.send(post);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getAllPostsBySender,
  getPostById,
  updatePost,
};
