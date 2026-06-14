const express = require("express");

const authControllers = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = express.Router();

authRouter.post("/register", authControllers.registerUser);
authRouter.post("/login", authControllers.loginUser);
authRouter.get("/logout", authControllers.logoutUser);
authRouter.get("/fetch-me", authMiddleware.authUser, authControllers.fetchMe);

module.exports = authRouter;