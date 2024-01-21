const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const authorRouter = require("./routers/authorRouter");
const blogRouter = require("./routers/blogRouter");

const app = express();
app.use(express.json());

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("mongo db is connected".red.underline.bold))
  .catch((err) => console.log(err.message));

app.use("/author", authorRouter);
app.use("/blog", blogRouter);

app.listen(process.env.PORT, () => {
  console.log("Express app running".blue.underline.bold);
});
 