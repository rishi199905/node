const mongoose = require("mongoose");

const UserShema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: 3,
    maxLength: 15,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 12,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate: (value) => {
      if (!["male", "female", "others"].includes(value.lowercase())) {
        throw new Error("Gender not allowed");
      }
    },
  },
  photoUrl: {
    type: String,
    required: true,
    default:
      "https://giftolexia.com/wp-content/uploads/2015/11/dummy-profile-200x200.png",
  },
  about: {
    type: String,
    default: "default about",
  },
  skills: {
    type: [String],
  },
}, {timestamps : true});

const User = mongoose.model("User", UserShema);
module.exports = User;
