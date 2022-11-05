const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGO_URL;

console.log("Connection");
console.log(mongoUrl);

mongoose.connect(
  mongoUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, req, res) => {
    mongoose.set("debug", true);
    if (err) throw err;
    else {
      try {
        console.log("Connected successfully");
      } catch (error) {
        throw error;
      }
    }
  }
);