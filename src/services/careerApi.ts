import type {
  CvAnalysisResult,
  CvImprovementResult,
  ExperienceLevel,
  InterviewQuestionsResult,
  JobMatchResult,
} from '../types/career.ts';

async function postJson<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let payload: { data?: TResponse; error?: string; success?: boolean; acknowledgement?: string } | null =
    null;
  try {
    payload = await response.json();
  } catch {
    throw new Error('Received an unexpected response from the server. Please try again.');
  }

  if (!response.ok) {
    throw new Error(
      payload?.error || `Request failed (${response.status}). Please try again.`,
    );
  }

  if (payload && 'data' in payload && payload.data !== undefined) {
    return payload.data;
  }

  return payload as unknown as TResponse;
}

export function requestCvAnalysis(cvText: string): Promise<CvAnalysisResult> {
  return postJson<CvAnalysisResult>('/api/career/analyse-cv', { cvText });
}

export function requestJobMatch(
  cvText: string,
  jobDescription: string,
): Promise<JobMatchResult> {
  return postJson<JobMatchResult>('/api/career/match-job', {
    cvText,
    jobDescription,
  });
}

export function requestCvImprovement(
  cvText: string,
  targetRole?: string,
): Promise<CvImprovementResult> {
  return postJson<CvImprovementResult>('/api/career/improve-cv', {
    cvText,
    targetRole,
  });
}

export function requestInterviewQuestions(input: {
  jobTitle: string;
  companyOrIndustry?: string;
  jobDescription?: string;
  experienceLevel: ExperienceLevel;
}): Promise<InterviewQuestionsResult> {
  return postJson<InterviewQuestionsResult>('/api/career/interview-questions', input);
}

export function submitContactInquiry(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<{ success: boolean; acknowledgement: string }> {
  return postJson<{ success: boolean; acknowledgement: string }>('/api/contact', input);
}
