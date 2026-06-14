const express = require("express");

const authControllers = require("../controllers/auth.controller");

const authRouter = express.Router();

authRouter.post("/register", authControllers.registerUser);
authRouter.post("/login", authControllers.loginUser);
authRouter.get("/logout", authControllers.logoutUser);

module.exports = authRouter;