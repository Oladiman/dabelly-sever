const express = require("express");
const router = express.Router();
const { adminRequired } = require("../middleware/auth.middleware");

const db = require("../models");

const { Admin } = require("../helpers");

router.post("/create", Admin.createAdmin);
router.post("/sign-in", Admin.adminSignIn);

router.post("/user-upgrade/profit", adminRequired, Admin.updateProfit);
router.post("/user-upgrade/balance", adminRequired, Admin.updateBalance);

router.get("/get/user/all", adminRequired, Admin.getAllUsers);
router.get("/get/user", adminRequired, Admin.getUser);

module.exports = router;
