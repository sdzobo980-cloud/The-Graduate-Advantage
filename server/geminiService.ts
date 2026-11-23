import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import type {
  CvAnalysisResult,
  CvImprovementResult,
  ExperienceLevel,
  InterviewQuestionsResult,
  JobMatchResult,
} from '../src/types/career.ts';

const MODEL_NAME = 'gemini-4-hydrogen';

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your Gemini API key in Settings > Secrets.',
    );
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateStructuredJson<T>(params: {
  systemInstruction: string;
  prompt: string;
  responseSchema: Record<string, unknown>;
  thinkingLevel?: ThinkingLevel;
}): Promise<T> {
  const ai = getAiClient();
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: params.prompt,
        config: {
          systemInstruction: params.systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: params.responseSchema,
          thinkingConfig: {
            thinkingLevel: params.thinkingLevel ?? ThinkingLevel.LOW,
          },
        },
      });

      const rawText = response.text?.trim();
      if (!rawText) {
        throw new Error('The AI service returned an empty response. Please try again.');
      }

      return JSON.parse(rawText) as T;
    } catch (error: unknown) {
      lastError = error;
      const errObj = error as { status?: number; message?: string };
      const status = errObj?.status;
      const isRetryable =
        status === 429 ||
        status === 503 ||
        (typeof errObj?.message === 'string' &&
          (errObj.message.includes('429') ||
            errObj.message.includes('503') ||
            errObj.message.includes('UNAVAILABLE')));

      if (isRetryable && attempt < maxAttempts) {
        const delayMs = 600 * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      break;
    }
  }

  throw formatGeminiError(lastError);
}

function formatGeminiError(error: unknown): Error {
  const errObj = error as { status?: number; message?: string };
  const msg = errObj?.message || 'Unable to process request with Gemini AI.';

  if (
    errObj?.status === 403 ||
    errObj?.status === 400 ||
    msg.includes('PERMISSION_DENIED') ||
    msg.includes('API_KEY_INVALID')
  ) {
    return new Error(
      'The Gemini API key appears invalid or lacks permission. Please verify GEMINI_API_KEY in Settings > Secrets.',
    );
  }

  if (errObj?.status === 429 || msg.includes('RESOURCE_EXHAUSTED')) {
    return new Error(
      'The AI service is temporarily busy due to rate limits. Please wait a moment and try again.',
    );
  }

  return new Error(msg);
}

export async function analyseCv(cvText: string): Promise<CvAnalysisResult> {
  const systemInstruction = `You are a senior graduate career advisor for The Graduate Advantage.
Your task is to perform a thorough, honest, structured analysis of a candidate's submitted CV or resume text.

STRICT RULES:
1. Analyse ONLY what is explicitly present in the submitted CV text.
2. NEVER invent, assume, or fabricate qualifications, employment history, dates, skills, or achievements that are not in the submitted CV.
3. Keep your tone constructive, encouraging, professional, and practical for university students, recent graduates, or young professionals.
4. Provide specific, actionable feedback grounded directly in the CV provided.
5. If a category (e.g., Projects or Experience) has nothing listed in the CV, return an empty array or clearly note what is missing in missingOrUnclearInformation.`;

  const prompt = `Analyse the following submitted CV/resume text thoroughly and return the structured JSON assessment:\n\n---\n${cvText}\n---`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overallAssessment: {
        type: Type.STRING,
        description:
          'A clear, constructive 3-4 sentence overall assessment of the CV readiness for graduate or early-career roles.',
      },
      presentationAndStructure: {
        type: Type.STRING,
        description:
          'Assessment of section order, readability, conciseness, formatting consistency, and clarity based on the submitted text.',
      },
      skillsIdentified: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Technical, analytical, software, language, or transferable skills explicitly stated in the CV.',
      },
      educationAndQualifications: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Degrees, institutions, modules, grades, certifications, or academic qualifications explicitly mentioned.',
      },
      projectsAndExperience: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Work experience, internships, volunteering, societies, or academic projects explicitly mentioned.',
      },
      strengths: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Concrete strengths demonstrated in the submitted CV.',
      },
      areasToImprove: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Practical, specific improvements that would strengthen the CV.',
      },
      missingOrUnclearInformation: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Important details that appear absent, vague, or unquantified in the CV (e.g., missing dates, unclear project outcomes, absent contact/portfolio links).',
      },
    },
    required: [
      'overallAssessment',
      'presentationAndStructure',
      'skillsIdentified',
      'educationAndQualifications',
      'projectsAndExperience',
      'strengths',
      'areasToImprove',
      'missingOrUnclearInformation',
    ],
  };

  return generateStructuredJson<CvAnalysisResult>({
    systemInstruction,
    prompt,
    responseSchema,
  });
}

export async function matchJobDescription(
  cvText: string,
  jobDescription: string,
): Promise<JobMatchResult> {
  const systemInstruction = `You are a senior graduate recruitment advisor for The Graduate Advantage.
Your task is to compare a candidate's CV against a specific job description accurately and ethically.

STRICT RULES:
1. Base your comparison strictly on facts present in the submitted CV and requirements stated in the job description.
2. NEVER invent an arbitrary percentage match score (e.g., do not output "78% match" or any numeric hiring score). Provide a clear qualitative assessment instead.
3. NEVER encourage the candidate to lie, exaggerate, or fabricate experience, skills, or qualifications.
4. Highlight honest transferable skills or academic projects where relevant, while clearly distinguishing between demonstrated evidence and gaps.
5. Give practical, truthful suggestions for tailoring the application and preparing for interview questions on uncovered or priority areas.`;

  const prompt = `Compare the candidate CV with the target job description below and return a structured comparison.\n\nCANDIDATE CV:\n---\n${cvText}\n---\n\nJOB DESCRIPTION:\n---\n${jobDescription}\n---`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      matchAssessment: {
        type: Type.STRING,
        description:
          'Clear qualitative overall assessment of how well the candidate aligns with the role, without any arbitrary percentage score.',
      },
      relevantMatchingSkills: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Skills explicitly found in the CV that directly align with the job requirements.',
      },
      relevantQualifications: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Academic degrees, coursework, or certifications in the CV that support the role.',
      },
      relevantExperienceAndProjects: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Work history, internships, volunteering, or academic projects in the CV relevant to the target role.',
      },
      importantJobRequirements: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Core responsibilities, skills, and qualifications prioritised in the job description.',
      },
      gapsNotClearlyDemonstrated: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Job requirements that are either missing from the CV or not clearly evidenced in the current wording.',
      },
      applicationImprovementSuggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Honest, practical ways to tailor the CV and cover letter to highlight relevant evidence truthfully without exaggeration.',
      },
      interviewTopicsToPrepare: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description:
          'Specific technical, competency, or situational topics the applicant should prepare to discuss in an interview for this role.',
      },
    },
    required: [
      'matchAssessment',
      'relevantMatchingSkills',
      'relevantQualifications',
      'relevantExperienceAndProjects',
      'importantJobRequirements',
      'gapsNotClearlyDemonstrated',
      'applicationImprovementSuggestions',
      'interviewTopicsToPrepare',
    ],
  };

  return generateStructuredJson<JobMatchResult>({
    systemInstruction,
    prompt,
    responseSchema,
  });
}

export async function improveCv(
  cvText: string,
  targetRole?: string,
): Promise<CvImprovementResult> {
  const systemInstruction = `You are a professional CV editor and graduate career coach for The Graduate Advantage.
Your task is to review the user's CV and suggest concrete improvements across standard CV sections.

STRICT RULES:
1. PRESERVE ALL ORIGINAL FACTS. Never create fictional experience, qualifications, grades, dates, metrics, certifications, achievements, or technical skills.
2. When rewriting weak or passive sentences into crisp, professional, active-voice wording, use ONLY facts present in the CV. If quantifiable metrics are missing, either omit invented numbers or indicate clearly with a bracketed prompt like [add exact number if known] ONLY as an optional placeholder, never inventing a fake figure.
3. Cover these eight areas in order inside the suggestions array:
   - Professional Summary
   - Skills Section
   - Education Section
   - Academic Projects
   - Internship Experience
   - Work Experience
   - Achievement Descriptions
   - Formatting and Clarity
4. If one of those sections is completely absent from the submitted CV (for example, no Internship Experience is listed), set status to "not_present", set originalWording to "Not currently included in submitted CV.", give helpful factual advice in suggestedWording (without inventing fake roles or employers), and explain in explanation how a graduate could structure or omit that section truthfully.
5. For sections present in the CV, quote the relevant originalWording faithfully from the CV, provide a polished suggestedWording that can be copied directly into their CV, and give a clear explanation of why the revision is stronger.`;

  const targetContext = targetRole?.trim()
    ? `Target Job Title / Industry: ${targetRole.trim()}\n\n`
    : 'Target Job Title / Industry: General graduate / early-career applications\n\n';

  const prompt = `${targetContext}Submitted CV:\n---\n${cvText}\n---\n\nReview and suggest factual, professional improvements across all 8 sections.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      overviewNotes: {
        type: Type.STRING,
        description:
          'Concise editorial summary explaining the main focus of the suggested revisions while preserving factual accuracy.',
      },
      suggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            section: {
              type: Type.STRING,
              description:
                'Section name (e.g., Professional Summary, Skills Section, Education Section, Academic Projects, Internship Experience, Work Experience, Achievement Descriptions, Formatting and Clarity).',
            },
            status: {
              type: Type.STRING,
              enum: ['improved', 'already_strong', 'not_present'],
              description:
                'Whether the section was rewritten/improved, is already strong, or is not present in the submitted CV.',
            },
            originalWording: {
              type: Type.STRING,
              description:
                'Exact excerpt or summary of original wording from the submitted CV, or note that it is absent.',
            },
            suggestedWording: {
              type: Type.STRING,
              description:
                'Polished, truthful replacement wording ready to copy, or truthful structural guidance if absent.',
            },
            explanation: {
              type: Type.STRING,
              description: 'Why the suggested wording is clearer, stronger, or better suited to employers.',
            },
          },
          required: [
            'section',
            'status',
            'originalWording',
            'suggestedWording',
            'explanation',
          ],
        },
      },
      formattingAndClarityTips: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Practical layout, typography, length, and clarity tips tailored to this CV.',
      },
    },
    required: ['overviewNotes', 'suggestions', 'formattingAndClarityTips'],
  };

  return generateStructuredJson<CvImprovementResult>({
    systemInstruction,
    prompt,
    responseSchema,
  });
}

export async function generateInterviewQuestions(input: {
  jobTitle: string;
  companyOrIndustry?: string;
  jobDescription?: string;
  experienceLevel: ExperienceLevel;
}): Promise<InterviewQuestionsResult> {
  const systemInstruction = `You are a graduate interview coach for The Graduate Advantage.
Your task is to generate tailored, realistic interview preparation material based on the candidate's target job title, optional company/industry, optional job description, and experience level (Student, Recent Graduate, or Experienced Applicant).

STRICT RULES:
1. Tailor the depth and framing to the stated experience level. For Students and Recent Graduates, emphasise university coursework, academic projects, societies, volunteering, part-time roles, and internships where appropriate.
2. Include the STAR method (Situation, Task, Action, Result) clearly as a guide for behavioural questions, and structure every behavioural question using STAR prompts.
3. NEVER present suggested answer structures as the candidate's actual experience. Frame them explicitly as frameworks/templates that the applicant must personalise truthfully with their own real examples.
4. Keep questions practical, realistic, and representative of structured employer interviews.`;

  const details = [
    `Job Title: ${input.jobTitle.trim()}`,
    `Experience Level: ${input.experienceLevel}`,
    input.companyOrIndustry?.trim()
      ? `Company or Industry: ${input.companyOrIndustry.trim()}`
      : 'Company or Industry: Not specified',
    input.jobDescription?.trim()
      ? `Job Description:\n${input.jobDescription.trim()}`
      : 'Job Description: Not provided (generate role-appropriate questions based on job title and experience level).',
  ].join('\n');

  const prompt = `Generate structured interview preparation material for the following applicant profile:\n\n${details}`;

  const questionItemSchema = {
    type: Type.OBJECT,
    properties: {
      question: { type: Type.STRING },
      focusOrContext: {
        type: Type.STRING,
        description: 'What the interviewer is assessing or why this question is asked.',
      },
      suggestedAnswerStructure: {
        type: Type.STRING,
        description:
          'A step-by-step framework the candidate can personalise truthfully with their own real experience.',
      },
    },
    required: ['question', 'focusOrContext', 'suggestedAnswerStructure'],
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      preparationOverview: {
        type: Type.STRING,
        description:
          'Brief guidance tailored to the role and experience level, including a reminder to personalise every example truthfully.',
      },
      starMethodGuide: {
        type: Type.OBJECT,
        properties: {
          situation: { type: Type.STRING },
          task: { type: Type.STRING },
          action: { type: Type.STRING },
          result: { type: Type.STRING },
          truthfulnessNote: { type: Type.STRING },
        },
        required: ['situation', 'task', 'action', 'result', 'truthfulnessNote'],
      },
      generalQuestions: {
        type: Type.ARRAY,
        items: questionItemSchema,
        description: '3-4 general opening, motivation, and role-fit interview questions.',
      },
      technicalQuestions: {
        type: Type.ARRAY,
        items: questionItemSchema,
        description: '3-4 role-specific technical or domain knowledge questions.',
      },
      behaviouralQuestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            competency: { type: Type.STRING },
            starStructure: {
              type: Type.OBJECT,
              properties: {
                situation: { type: Type.STRING },
                task: { type: Type.STRING },
                action: { type: Type.STRING },
                result: { type: Type.STRING },
              },
              required: ['situation', 'task', 'action', 'result'],
            },
          },
          required: ['question', 'competency', 'starStructure'],
        },
        description: '3-4 behavioural questions structured with STAR guidance.',
      },
      problemSolvingQuestions: {
        type: Type.ARRAY,
        items: questionItemSchema,
        description: '2-3 analytical, scenario, or problem-solving questions.',
      },
      academicAndInternshipQuestions: {
        type: Type.ARRAY,
        items: questionItemSchema,
        description:
          '2-3 questions exploring academic projects, dissertations, coursework, or internships/early experience.',
      },
      questionsToAskInterviewer: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            purpose: { type: Type.STRING },
          },
          required: ['question', 'purpose'],
        },
        description: '4 thoughtful questions the candidate can ask at the end of the interview.',
      },
    },
    required: [
      'preparationOverview',
      'starMethodGuide',
      'generalQuestions',
      'technicalQuestions',
      'behaviouralQuestions',
      'problemSolvingQuestions',
      'academicAndInternshipQuestions',
      'questionsToAskInterviewer',
    ],
  };

  return generateStructuredJson<InterviewQuestionsResult>({
    systemInstruction,
    prompt,
    responseSchema,
  });
}
