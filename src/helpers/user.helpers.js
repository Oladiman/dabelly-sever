const db = require("../models");
const jwt = require("jsonwebtoken");

const { SendVerificationEmail, SendRecoveryEmail } = require("./nodemailer");

exports.userSignIn = async function (req, res, next) {
  try {
    let user = await db.User.findOne({
      email: req.body.email,
    });

    if (!user) {
      next({
        status: 400,
        message: "Email not found",
      });
    }

    let isMatch = await user.comparePassword(req.body.password);
    let {
      id,
      firstname,
      surname,
      email,
      role,
      plan,
      verified,
      balance,
      phoneNumber,
      profit,
    } = user;
    if (isMatch) {
      let token = jwt.sign(
        {
          id,
          firstname,
          surname,
          email,
          role,
        },
        process.env.SECRET_KEY
      );

      return res.status(200).json({
        user: {
          id,
          email,
          firstname,
          surname,
          role,
          plan,
          verified,
          balance,
          phoneNumber,
          profit,
        },
        token,
      });
    } else {
      next({
        status: 400,
        message: "Invalid email or password",
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.userSignUp = async function (req, res, next) {
  try {
    let foundUser = await db.User.findOne({ email: req.body.email });

    if (foundUser) {
      console.log(foundUser);
      return next({
        status: 400,
        message: "Sorry, that email is taken",
      });
    }

    let user = await db.User.create(req.body);

    let { id, firstname, surname, email } = user;

    let token = jwt.sign(
      {
        id,
        firstname,
        surname,
        email,
      },
      process.env.SECRET_KEY
    );

    SendVerificationEmail({ email, firstname, id }, "https://trustfxpro.com");

    return res.status(200).json({
      user: { id, email, firstname, surname },
      token,
    });
  } catch (err) {
    console.log({ err });
    if (err.code === 11000) {
      err.message = "Sorry, that email is taken";
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.getProfile = async function (req, res, next) {
  if (!req.headers.authorization) {
    return next({
      status: 401,
      message: "Please log in",
    });
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (decoded) {
        const retrieveInfo = async function () {
          let user;
          try {
            decoded.role === "user"
              ? (user = await db.User.findById(decoded.id))
              : (user = await db.Admin.findById(decoded.id));
            let {
              id,
              firstname,
              surname,
              email,
              role,
              plan,
              verified,
              balance,
              phoneNumber,
              profit,
              username,
            } = user;
            return res.status(200).json(
              decoded.role === "user"
                ? {
                    user: {
                      id,
                      firstname,
                      surname,
                      email,
                      role,
                      plan,
                      verified,
                      balance,
                      phoneNumber,
                      profit,
                    },
                  }
                : { admin: { id, email, firstname, surname, username } }
            );
          } catch (err) {
            return next({
              status: 401,
              message: "Account does not exist, sign up first",
            });
          }
        };
        retrieveInfo();
      } else {
        return next({
          status: 401,
          message: "Account does not exist, sign up first",
        });
      }
    });
  } catch (err) {}
};

exports.verifyUser = async function (req, res, next) {
  try {
    let uid = req.params.uid;

    console.log({ uid });

    let user = await db.User.findById(uid);

    console.log(user);

    await user.set({ verified: true }).save();

    return res.status(200).json({ message: "Account verified" });
  } catch (err) {
    return next({
      status: 401,
      message: "Account does not exist, sign up first",
    });
  }
};

exports.requestRecovery = async function (req, res, next) {
  try {
    const email = req.body.email;

    if (!email) {
      return next({
        status: 400,
        message: "Sorry, email is missing",
      });
    }

    const user = await db.User.findOne({ email: email });

    if (!user) {
      return next({
        status: 400,
        message: "Sorry, that user doesn't exist",
      });
    }

    await SendVerificationEmail(
      { email: user.email, firstname: user.firstname, id: user.id },
      "https://trustfxpro.com"
    );

    return res.status(200).json({ message: "reset email sent" });
  } catch (err) {}
};

exports.resetPassword = async function (req, res, next) {
  try {
    const password = req.body.password;
    const id = req.body.id;

    if (!password) {
      return next({
        status: 400,
        message: "Sorry, password is missing",
      });
    }

    const user = await db.User.findById(id);

    if (!user) {
      return next({
        status: 400,
        message: "Sorry, that user doesn't exist",
      });
    }

    await user.set({ password }).save();

    return res.status(200).json({ message: "password reset successful" });
  } catch (err) {}
};

module.exports = exports;
