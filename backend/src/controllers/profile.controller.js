const userModel = require("../models/user.model");
const resumeReportModel = require("../models/resumeReport.model");

async function getProfile(req, res) {
    const user = await userModel.findOne({
        email: req.user.email
    })

    const report = await resumeReportModel.find({
        user: user._id
    }).select("_id matchScore jobDescription createdAt");

    return res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        reports: report
    })
}

module.exports = { getProfile };