const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
require("./db");

app.use(cors());
app.use(morgan("dev"));

//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", require("./routes/index"));

let PORT = process.env.PORT || 8888;

app.listen(PORT, () => {
  console.log(chalk.blue("[ ✓ ] Running on port : " + PORT));
  app.emit("app_started");
});