const pdfParse = require("pdf-parse");
const generateResumeReportHelper = require("../services/ai.service");
const resumeReportModel = require("../models/resumeReport.model");

async function generateResumeReport(req, res) {
    const resumeFile = req.file;

    const parser = new pdfParse.PDFParse({ data: req.file.buffer });
    const resumeContent = await parser.getText();
    await parser.destroy();
    const { selfDescription, jobDescription } = req.body;

    const resumeReportByAI = await generateResumeReportHelper({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    });

    const resumeReport = await resumeReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...resumeReportByAI
    });

    res.status(201).json({
        message: "Resume report generated successfully",
        resumeReport: resumeReport
    })
}

async function getResumeReport(req, res) {
    const report = await resumeReportModel.findOne({
        _id: req.params.id,
        user: req.user.id
    })

    if(!report) {
        return res.status(401).json({
            message: "Report not found!"
        })
    }

    res.status(200).json(report);
}

async function deleteResumeReport(req, res) {
    await resumeReportModel.deleteOne({
        _id: req.params.id,
        user: req.user.id
    });
    return res.status(200).json({
        message: "Report deleted succesfully!"
    })
} 

module.exports = { generateResumeReport, getResumeReport, deleteResumeReport };