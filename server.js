const app = require("./src/app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const PORT = process.env.PORT || 3000;

export const MONGO_URL = process.env.MONGO_URL

mongoose
  .connect(`${MONGO_URL}/commentsAPI`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
