const pdfParse = require("pdf-parse");
const puppeteer = require("puppeteer");
const generateResumeReportHelper = require("../services/ai.service");
const resumeReportModel = require("../models/resumeReport.model");

function generateBeautifulHTML(report) {
    const scoreColor = report.matchScore >= 75 ? '#5CC9A7' : report.matchScore >= 50 ? '#F5C26B' : '#F27474';
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (report.matchScore / 100) * circumference;

    const logoSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 40 40" fill="none">
        <g>
            <path d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 1.02188e-06 18.5717 0C12.8885 -1.02188e-06 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z" fill="#297AFF" />
            <g>
                <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill="#34C2FF" />
                <path d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" fill="#34C2FF" />
            </g>
        </g>
    </svg>`;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@400;500;600;700&display=swap');
            
            :root {
                --color-mint: #B8E8D0;
                --color-lavender: #D5C6F0;
                --color-peach: #FCDAD1;
                --color-sky: #BDDCF5;
                --color-surface: #FAFBFE;
                --color-card: #FFFFFF;
                --color-heading: #2D2B3D;
                --color-body: #6E6B82;
                --color-muted: #9A97AE;
                --color-edge: #EDEEF5;
                --color-accent: #7C6AE8;
                --font-display: 'Fraunces', serif;
                --font-sans: 'Inter', sans-serif;
            }

            * { box-sizing: border-box; }
            
            @page { 
                size: A4; 
                margin-top: 50px;
                margin-bottom: 50px;
                margin-left: 0;
                margin-right: 0;
            }
            
            @page :first {
                margin: 0;
            }
            
            body { 
                font-family: var(--font-sans); 
                margin: 0; 
                padding: 0;
                background-color: white; 
                line-height: 1.6;
                color: var(--color-body);
                width: 210mm;
            }

            /* --- Sidebar (Left Column) --- */
            .sidebar {
                width: 70mm;
                height: 297mm;
                float: left;
                background-color: #2D2B3D; /* Deep premium background for sidebar */
                color: #FFFFFF;
                padding: 40px 30px;
                margin-right: 30px;
                overflow: hidden;
            }
            
            .brand {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 50px;
            }
            .brand-name {
                font-family: var(--font-sans);
                font-weight: 700;
                font-size: 20px;
                letter-spacing: -0.5px;
                color: white;
            }

            /* Circular Score */
            .score-wrapper {
                text-align: center;
                margin-bottom: 50px;
            }
            .score-title {
                font-family: var(--font-display);
                font-size: 16px;
                margin-bottom: 20px;
                color: var(--color-muted);
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            .circular-chart {
                display: block;
                margin: 0 auto;
                max-width: 140px;
                max-height: 140px;
            }
            .circle-bg {
                fill: none;
                stroke: rgba(255,255,255,0.1);
                stroke-width: 6;
            }
            .circle {
                fill: none;
                stroke: ${scoreColor};
                stroke-width: 6;
                stroke-linecap: round;
                stroke-dasharray: ${circumference};
                stroke-dashoffset: ${offset};
            }
            .percentage {
                fill: white;
                font-family: var(--font-display);
                font-size: 26px;
                font-weight: 600;
                text-anchor: middle;
            }
            
            /* Skills in Sidebar */
            .sidebar-section-title {
                font-family: var(--font-display);
                font-size: 15px;
                color: var(--color-muted);
                text-transform: uppercase;
                letter-spacing: 1.5px;
                margin-bottom: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
                padding-bottom: 10px;
            }
            .skill-item {
                margin-bottom: 15px;
            }
            .skill-name {
                font-size: 14px;
                font-weight: 500;
                color: white;
                display: block;
                margin-bottom: 4px;
            }
            .sev-badge {
                font-size: 11px;
                font-weight: 600;
                padding: 3px 8px;
                border-radius: 4px;
                display: inline-block;
                text-transform: uppercase;
            }
            .sev-high { background: rgba(242, 116, 116, 0.2); color: #F27474; }
            .sev-moderate { background: rgba(245, 194, 107, 0.2); color: #F5C26B; }
            .sev-low { background: rgba(92, 201, 167, 0.2); color: #5CC9A7; }


            /* --- Main Content (Right Column) --- */
            .main-content {
                padding: 50px 40px;
                background-color: white;
            }

            .main-title {
                font-family: var(--font-display);
                font-size: 34px;
                font-weight: 600;
                color: var(--color-heading);
                margin: 0 0 5px 0;
                line-height: 1.1;
                letter-spacing: -0.02em;
            }
            .subtitle {
                font-size: 15px;
                color: var(--color-accent);
                font-weight: 500;
                margin: 0 0 40px 0;
            }

            .section-header {
                font-family: var(--font-display);
                font-size: 20px;
                font-weight: 600;
                color: var(--color-heading);
                margin-top: 35px;
                margin-bottom: 20px;
                padding-bottom: 8px;
                border-bottom: 2px solid var(--color-edge);
                page-break-inside: avoid;
                page-break-after: avoid;
            }

            /* Clean Q&A Layout (Like resume bullet points) */
            .qna-item {
                margin-bottom: 22px;
                page-break-inside: avoid;
            }
            .qna-q {
                font-family: var(--font-sans);
                font-size: 15px;
                font-weight: 700;
                color: var(--color-heading);
                margin: 0 0 6px 0;
            }
            .qna-a {
                margin: 0 0 8px 0;
                font-size: 13.5px;
                color: var(--color-body);
                line-height: 1.6;
            }
            .intention {
                font-size: 12px;
                color: var(--color-accent);
                font-weight: 500;
            }

            /* Clean Plan Layout */
            .plan-day {
                margin-bottom: 25px;
                page-break-inside: avoid;
            }
            .plan-day h4 {
                margin: 0 0 10px 0;
                color: var(--color-heading);
                font-size: 15px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .plan-day h4 span {
                background: var(--color-surface);
                border: 1px solid var(--color-edge);
                color: var(--color-heading);
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
            }
            .plan-day ul {
                margin: 0;
                padding-left: 18px;
                font-size: 13.5px;
                color: var(--color-body);
            }
            .plan-day li {
                margin-bottom: 6px;
            }
        </style>
    </head>
    <body>
        
        <!-- Sidebar Column -->
        <div class="sidebar">
            <div class="brand">
                ${logoSVG}
                <span class="brand-name">Athena</span>
            </div>

            <div class="score-wrapper">
                <div class="score-title">ATS Match Score</div>
                <svg viewBox="0 0 100 100" class="circular-chart">
                    <path class="circle-bg"
                        d="M50 5
                           a 45 45 0 0 1 0 90
                           a 45 45 0 0 1 0 -90"
                    />
                    <path class="circle"
                        d="M50 5
                           a 45 45 0 0 1 0 90
                           a 45 45 0 0 1 0 -90"
                    />
                    <text x="50" y="58" class="percentage">${report.matchScore}%</text>
                </svg>
            </div>

            <div class="sidebar-section-title">Identified Gaps</div>
            <div>
                ${report.skillGaps.map(gap => `
                    <div class="skill-item">
                        <span class="skill-name">${gap.skill}</span>
                        <span class="sev-badge sev-${gap.severity}">${gap.severity} Priority</span>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Main Resume-style Content Column -->
        <div class="main-content">
            <h1 class="main-title">Analysis Report</h1>
            <p class="subtitle">Personalized Interview Strategy</p>

            <div class="section-header">Technical Preparation</div>
            ${report.technicalQuestions.map(tq => `
                <div class="qna-item">
                    <p class="qna-q">Q: ${tq.questions}</p>
                    <p class="qna-a">${tq.answer}</p>
                    <span class="intention">Target: ${tq.intention}</span>
                </div>
            `).join('')}

            <div class="section-header">Behavioral Assessment</div>
            ${report.behavioralQuestions.map(bq => `
                <div class="qna-item">
                    <p class="qna-q">Q: ${bq.questions}</p>
                    <p class="qna-a">${bq.answer}</p>
                    <span class="intention">Target: ${bq.intention}</span>
                </div>
            `).join('')}

            <div class="section-header">Actionable Plan</div>
            ${report.preparationPlan.map(plan => `
                <div class="plan-day">
                    <h4><span>Day ${plan.day}</span> ${plan.focus}</h4>
                    <ul>
                        ${plan.tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>
        
    </body>
    </html>
    `;
}


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

    if (!report) {
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

async function exportResumeReport(req, res) {
    try {
        const report = await resumeReportModel.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            })
        }

        const html = generateBeautifulHTML(report);
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            preferCSSPageSize: true
        });

        await browser.close();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader('Content-Disposition', `attachment; filename="Athena-Report-${req.user.firstName}-${req.params.id}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        res.end(pdfBuffer);
    } catch (error) {
        console.error("PDF Export Error:", error);
        res.status(500).json({
            message: "Failed to generate PDF document"
        });
    }
}

module.exports = { generateResumeReport, getResumeReport, deleteResumeReport, exportResumeReport };