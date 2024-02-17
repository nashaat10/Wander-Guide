const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please write your name"],
  },
  email: {
    type: String,
    require: [true, "please write your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please write a valid email"],
  },
  password: {
    type: String,
    require: [true, "please write your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    require: [true, "please confirm your password"],
    // this only works on create and save
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "passwords are not the same",
    },
  },
  photo: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
