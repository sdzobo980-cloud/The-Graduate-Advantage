export type CareerToolId =
  | 'cv-analyser'
  | 'job-matcher'
  | 'cv-improver'
  | 'interview-generator';

export type PageView = 'home' | 'tools' | 'about' | 'contact';

export type ExperienceLevel =
  | 'Student'
  | 'Recent Graduate'
  | 'Experienced Applicant';

export interface CvAnalysisResult {
  overallAssessment: string;
  presentationAndStructure: string;
  skillsIdentified: string[];
  educationAndQualifications: string[];
  projectsAndExperience: string[];
  strengths: string[];
  areasToImprove: string[];
  missingOrUnclearInformation: string[];
}

export interface JobMatchResult {
  matchAssessment: string;
  relevantMatchingSkills: string[];
  relevantQualifications: string[];
  relevantExperienceAndProjects: string[];
  importantJobRequirements: string[];
  gapsNotClearlyDemonstrated: string[];
  applicationImprovementSuggestions: string[];
  interviewTopicsToPrepare: string[];
}

export interface CvImprovementSuggestion {
  section: string;
  status: 'improved' | 'already_strong' | 'not_present';
  originalWording: string;
  suggestedWording: string;
  explanation: string;
}

export interface CvImprovementResult {
  overviewNotes: string;
  suggestions: CvImprovementSuggestion[];
  formattingAndClarityTips: string[];
}

export interface InterviewQuestionItem {
  question: string;
  focusOrContext: string;
  suggestedAnswerStructure: string;
}

export interface BehaviouralQuestionItem {
  question: string;
  competency: string;
  starStructure: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface InterviewQuestionsResult {
  preparationOverview: string;
  starMethodGuide: {
    situation: string;
    task: string;
    action: string;
    result: string;
    truthfulnessNote: string;
  };
  generalQuestions: InterviewQuestionItem[];
  technicalQuestions: InterviewQuestionItem[];
  behaviouralQuestions: BehaviouralQuestionItem[];
  problemSolvingQuestions: InterviewQuestionItem[];
  academicAndInternshipQuestions: InterviewQuestionItem[];
  questionsToAskInterviewer: Array<{
    question: string;
    purpose: string;
  }>;
}
