const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    select: false, // this will not show the password in the response
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
  passwordChangedAt: Date,

  photo: String,
});

// Document Middleware: runs before .save() and .create()
userSchema.pre("save", async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm field from the database
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
