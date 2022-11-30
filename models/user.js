const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  user_name: {
    type: String,
    required: true,
  },
  house_address: {
    type: String,
    // required: true,
  },
  phone_number: {
    type: String,
    min: [11, 'inavlid phone number'],
    required: true,
    unique: true,
  },
},{timestamps:true});

module.exports = {User: mongoose.model("user", userSchema)};
