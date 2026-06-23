const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const resumeControllers = require("../controllers/resume.controller");

const resumeRouter = express.Router();

resumeRouter.post("/", authMiddleware.authUser, upload.single("resume"), resumeControllers.generateResumeReport);

module.exports = resumeRouter;