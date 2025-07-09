// Type definitions for the application
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'text' | 'multiple_choice' | 'code';
export type SessionStatus = 'not_started' | 'in_progress' | 'completed' | 'evaluated';

export interface InterviewQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  difficulty?: Difficulty;
  category?: string;
  timeLimit?: number;
}

export interface InterviewSession {
  id: string;
  userId: string;
  professionId: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  status: SessionStatus;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  feedback?: string;
}

export interface Profession {
  id: string;
  name: string;
  description: string;
  categories: string[];
  difficultyLevels: string[];
  questionCount: number;
  averageScore?: number;
  icon?: string;
  color?: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  timeSpent: number;
  submittedAt: string;
}

export interface InterviewEvaluation {
  sessionId: string;
  userId: string;
  professionId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  answers: UserAnswer[];
  feedback: string;
  strengths: string[];
  areasForImprovement: string[];
  completedAt: string;
}
