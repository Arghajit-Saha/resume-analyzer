const mongoose = require("mongoose");

const blacklist = new mongoose.Schema({
    token: {
        type: [String, "Token is required to be added in the blacklist"],
        required: true
    }
}, {
    timestamps: true
});

const tokenBlacklistModel = mongoose.model("blacklist", blacklist);

module.exports = tokenBlacklistModel;