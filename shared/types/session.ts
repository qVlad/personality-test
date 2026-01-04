import type { Pole, Question } from './question.js';
import type { MBTICode, PersonalityType } from './personality.js';

export type SessionStatus = 'in_progress' | 'completed';

export interface Session {
  id: string;
  currentQuestion: number;
  status: SessionStatus;
  result: MBTICode | null;
}

export interface Answer {
  questionId: number;
  selectedPole: Pole;
}

export interface SessionWithAnswers extends Session {
  answers: Answer[];
}

// API Response types
export interface SessionResponse {
  id: string;
  currentQuestion: number;
  status: SessionStatus;
  totalQuestions: number;
  result: MBTICode | null;
}

export interface QuestionResponse {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  previousAnswer: Pole | null;
}

export interface TestCompletedResponse {
  completed: true;
  result: MBTICode;
}

export interface ResultResponse {
  personalityType: PersonalityType;
  answers: Answer[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AnswerRequest {
  questionId: number;
  selectedPole: Pole;
}
