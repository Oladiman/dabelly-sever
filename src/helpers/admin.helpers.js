const db = require("../models");
const jwt = require("jsonwebtoken");

exports.adminSignIn = async function (req, res, next) {
  try {
    let admin = await db.Admin.findOne({
      username: req.body.username,
    });

    if (!admin) {
      return next({
        status: 400,
        message: "Username not found",
      });
    }

    let isMatch = await admin.comparePassword(req.body.password);
    let { id, username, role } = admin;
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          username,
          role,
        },
        process.env.SECRET_KEY
      );

      return res.status(200).json({
        admin: { id, username, role },
        token,
      });
    } else {
      return next({
        status: 400,
        message: "Invalid username or password",
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.createAdmin = async function (req, res, next) {
  try {
    let admin = await db.Admin.create(req.body);
    let { id, role, username } = admin;

    let token = jwt.sign(
      {
        id,
        role,
        username,
      },
      process.env.SECRET_KEY
    );

    return res.status(200).json({
      admin: { role, username },
      token,
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Sorry, that usernam is taken";
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    //get all users reistered
    let users = await db.User.find();
    //return list of all users
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

exports.getUser = () => async (req, res, next) => {
  try {
    let email = req.body.email;

    if (!email) {
      return next({
        status: 400,
        message: "User email must be provided",
      });
    }
    let user = db.User.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User with email not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateProfit = async (req, res, next) => {
  try {
    let email = req.body.email;
    let profit = req.body.profit;
    if (!email || !profit) {
      return next({
        status: 402,
        message: "Email and profit must be provided",
      });
    }

    let user = await db.User.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User with email not found",
      });
    }

    await user.set({ profit }).save();

    return res.status(200).json({
      message: "success",
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateBalance = async (req, res, next) => {
  console.log("update");
  try {
    let email = req.body.email;
    let balance = req.body.balance;

    console.log({ email, balance });
    if (!email || !balance) {
      return next({
        status: 402,
        message: "Email and plan name must be provided",
      });
    }

    let user = await db.User.findOne({ email });

    if (!user) {
      return next({
        status: 400,
        message: "User with email not found",
      });
    }

    await user.set({ balance }).save();

    return res.status(200).json({
      message: "success",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = exports;
