const express = require("express");
const posts_router = require("./routes/posts_router");
const comments_router = require("./routes/comments_router");
const app = express();

app.use(express.json());

app.use("/posts", posts_router);
app.use("/comments", comments_router);

module.exports = app;
