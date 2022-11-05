const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mailerDeets = Schema(
  {
    from: {
      type: String,
      required: true
    },
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    text: {
        type: String
    },
    fromPass: {
        type: String,
        required: true
    },
    success: {
      type: Number,
      enum: [1,0]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("mailerDeets", mailerDeets, "mailerDeets");