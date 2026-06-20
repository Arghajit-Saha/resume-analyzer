const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const resumeReportZodSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        questions: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        questions: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGap: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "moderate", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    }))
});

const resumeReportSchema = {
  type: Type.OBJECT,
  required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGap", "preparationPlan"],
  properties: {
    matchScore: {
      type: Type.NUMBER,
      description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description. Example: 85",
    },
    technicalQuestions: {
      type: Type.ARRAY,
      description: "Technical questions which can be asked in an interview along with their intentions and how to approach such questions",
      items: {
        type: Type.OBJECT,
        required: ["questions", "intention", "answer"],
        properties: {
          questions: {
            type: Type.STRING,
            description: "Technical questions which can be asked in an interview",
          },
          intention: {
            type: Type.STRING,
            description: "The intention behind asking this question",
          },
          answer: {
            type: Type.STRING,
            description: "How to tackle this question, what points to cover, what should be the approach",
          },
        },
      },
    },
    behavioralQuestions: {
      type: Type.ARRAY,
      description: "Behavioral questions which can be asked in an interview along with their intentions and how to approach such questions",
      items: {
        type: Type.OBJECT,
        required: ["questions", "intention", "answer"],
        properties: {
          questions: {
            type: Type.STRING,
            description: "Behavioral questions which can be asked in an interview",
          },
          intention: {
            type: Type.STRING,
            description: "The intention behind asking this question",
          },
          answer: {
            type: Type.STRING,
            description: "How to tackle this question, what points to cover, what should be the approach",
          },
        },
      },
    },
    skillGap: {
      type: Type.ARRAY,
      description: "List of all skill gaps in the candidate's profile along with their severity",
      items: {
        type: Type.OBJECT,
        required: ["skill", "severity"],
        properties: {
          skill: {
            type: Type.STRING,
            description: "The skill which the candidate is lacking according to his resume/description",
          },
          severity: {
            type: Type.STRING,
            description: "The severity of this skill gap according to the job description demand",
            enum: ["low", "moderate", "high"],
          },
        },
      },
    },
    preparationPlan: {
      type: Type.ARRAY,
      description: "A day-wise plan for the candidate to follow in order to improve the match with the job description",
      items: {
        type: Type.OBJECT,
        required: ["day", "focus", "tasks"],
        properties: {
          day: {
            type: Type.INTEGER,
            description: "The day number in the preparation plan starting from 1",
          },
          focus: {
            type: Type.STRING,
            description: "The main focus of this day to follow the preparation plan",
          },
          tasks: {
            type: Type.ARRAY,
            description: "List of the tasks to be done on this day to follow the preparation plan",
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    },
  },
};

async function generateResumeReport({resume, selfdescription, jobdescription}) {
    const prompt = `Generate a resume report for a candidate with teh following details: 
        Resume: ${resume}
        Self Descripton: ${selfdescription}
        Job Description: ${jobdescription}
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumeReportSchema
        }
    });

    const report = resumeReportZodSchema.parse(JSON.parse(response.text));

    console.log(report);
}

module.exports = generateResumeReport;