const mongoose = require("mongoose");
const validator = require('validator')

const UserShema = new mongoose.Schema({
  firstName: {
    type: String,
    index: true,
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
    validate: (value) => {
        if (!validator.isEmail(value)) {
            throw new Error("Invalid Email")
        } 
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    validate: (value) => {
        if (!validator.isStrongPassword(value)) {
            throw new Error("Not strong password")
        } 
    }
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate: (value) => {
      if (!["male", "female", "others"].includes(value)) {
        throw new Error("Gender not allowed");
      }
    },
  },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
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
