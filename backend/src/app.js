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
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowedOrigins = process.env.ALLOWED_ORIGIN 
            ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, '')) 
            : [];
            
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin, "Allowed:", allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/profile", profileRouter);

module.exports = app;