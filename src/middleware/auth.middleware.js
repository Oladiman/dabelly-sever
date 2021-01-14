// require('dotenv').load()
const jwt = require("jsonwebtoken");

exports.loginRequired = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Please log in first",
        });
      }
    });
  } catch (err) {
    return next({
      status: 401,
      message: "Please log in first",
    });
  }
};

exports.authorizationRequired = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded && decoded.id === req.params.id) {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized",
        });
      }
    });
  } catch (err) {
    return next({
      status: 401,
      message: "Unauthorized",
    });
  }
};

exports.adminRequired = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded && decoded.role === "admin") {
        return next();
      } else {
        return next({
          status: 401,
          message: "Unauthorized, not an admin",
        });
      }
    });
  } catch (err) {
    return next({
      status: 401,
      message: "Unauthorized",
    });
  }
};

module.exports = exports;
