export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  isTyping?: boolean;
}

export interface InterviewData {
  profession: string;
  interviewee: string;
  transcript: Message[];
}

export interface FeedbackData {
  overallAssessment: string;
  strengths: string[];
  areasForImprovement: string[];
  questionQuality: string;
  followUpSkills: string;
  effectiveQuestions: string[];
  missedOpportunities: string[];
  recommendations: string[];
  keyInsights: string[];
  skillsDemonstrated?: string[];
  interviewStructure?: {
    opening: string;
    body: string;
    closing: string;
  };
  careerExplorationValue?: string;
  ratings: {
    overall: number;
    questionDepth: number;
    activeListening: number;
    followUp: number;
    etiquette: number;
    explorationValue: number;
  };
  statistics?: {
    questionCount: number;
    duration: number;
    averageResponseLength: number;
  };
}

export interface IntervieweeInfo {
  name: string;
  profession: string;
  experience: string;
  skills: string[];
  education: string;
  age?: number;
  role?: string;
  company?: string;
  background?: string;
  highlights?: string[];
  avatarInitials?: string;
  personalDetails?: string;
}
