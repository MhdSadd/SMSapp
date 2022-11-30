const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  }
});
module.exports ={ Admin: mongoose.model("admin", adminSchema)}