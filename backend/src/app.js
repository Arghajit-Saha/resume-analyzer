const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.route");
const resumeRouter = require("./routes/resume.route");
const profileRouter = require("./routes/profile.route");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5173", "https://cnv2h388-5173.inc1.devtunnels.ms"],
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/profile", profileRouter);

module.exports = app;