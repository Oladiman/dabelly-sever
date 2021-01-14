const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = Promise;

mongoose.connect(process.env.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports.User = require("./user");
module.exports.Admin = require("./admin");
