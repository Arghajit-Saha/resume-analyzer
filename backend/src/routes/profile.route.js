const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const profileControllers = require("../controllers/profile.controller")

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware.authUser, profileControllers.getProfile);

module.exports = profileRouter;
