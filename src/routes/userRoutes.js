const express = require("express");
const router = express.Router();

const { User } = require("../helpers");

router.post("/sign-up", User.userSignUp);
router.post("/sign-in", User.userSignIn);
router.post("/verify/:uid", User.verifyUser);
router.post("/forgot", User.requestRecovery);
router.post("/reset", User.resetPassword);

module.exports = router;
