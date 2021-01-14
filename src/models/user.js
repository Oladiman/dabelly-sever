const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  plan: {
    type: String,
    required: true,
    default: "basic",
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  country: {
    type: String,
    default: "United Kingdom",
    required: true,
  },
  profit: {
    type: Number,
    required: true,
    default: 0,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    let hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (recievedPassword, next) {
  try {
    let isMatch = await bcrypt.compare(recievedPassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};
const User = mongoose.model("User", userSchema);
module.exports = User;
