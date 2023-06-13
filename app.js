require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");

const dbconnect = require("./db/conn");

const filesRouter = require("./routes/files");
const showRouter = require("./routes/show");
const downloadRouter = require("./routes/download");

app.use(express.static("./public"));
app.use(express.json());

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("index");
});

app.use("/api/v1/files", filesRouter);
app.use("/files", showRouter);
app.use("/files/download", downloadRouter);

const start = async () => {
  try {
    await dbconnect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server started at ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
