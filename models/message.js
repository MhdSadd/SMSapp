const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    message_body: {
      type: String,
      required: true,
    },
    send_time: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = { Message: mongoose.model("message", messageSchema) };
