const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userModel = require("../models/user.model");
const tokenBlacklistModel = require("../models/blacklist.model");

async function registerUser(req, res) {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        });
    }

    const isUserAlreadyExists = await userModel.findOne({
        email
    });

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with same username or email address"
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
        firstName,
        lastName,
        email,
        password: hash
    });

    const token = await jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_SECRET);

    res.cookie("token", token);
    res.status(201).json({
        message: "User registered successfully!",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    });

    if(!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const token = await jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT_SECRET);

    res.cookie("token", token);
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    })
}

async function logoutUser(req, res) {
    const token = req.cookies.token;

    if(token) {
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}

async function fetchMe(req, res) {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }
    });
}

module.exports = { registerUser, loginUser, logoutUser, fetchMe };