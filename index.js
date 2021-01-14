//importing environment config
if (process.env.NODE_ENV !== "production") require("dotenv").config();

const http = require("http");

const express = require("express");
const cors = require("cors");
// const bodyparser = require("body-parser");
// const socketio = require("socket.io");
//helper functions
const errorHandler = require("./src/helpers/error-handler.helpers");

const moment = require("moment");

//initializing the app
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

//sub-route handling fnctions
const admin_routes = require("./src/routes/adminRoutes");
const user_routes = require("./src/routes/userRoutes");

//get profile helper

const { getProfile } = require("./src/helpers/user.helpers");

//all routes handling

app.use("/api/v1/admin", admin_routes);
app.use("/api/v1/user", user_routes);

app.get("/api/v1/auth/profile", getProfile);

app.use("/base", (req, res, next) => {
  res.json({ msg: "welcome" });
});

app.use(function (req, res, next) {
  let err = new Error("Not found");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

server.listen(PORT, function () {
  console.log(`listen on port ${PORT}`);
});
