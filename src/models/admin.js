const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "admin",
  },
});

adminSchema.pre("save", async function (next) {
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

adminSchema.methods.comparePassword = async function (recievedPassword, next) {
  try {
    let isMatch = await bcrypt.compare(recievedPassword, this.password);
    return isMatch;
  } catch (err) {
    return next(err);
  }
};
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
