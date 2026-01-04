import type { AnswerValue, Question } from './question.js';
import type { ArchetypeCode, PersonalityType, TraitScore } from './personality.js';

export type SessionStatus = 'in_progress' | 'completed';

export interface Session {
  id: string;
  currentQuestion: number;
  status: SessionStatus;
  result: ArchetypeCode | null;
}

export interface Answer {
  questionId: number;
  selectedOption: AnswerValue;
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
  result: ArchetypeCode | null;
}

export interface QuestionResponse {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  previousAnswer: AnswerValue | null;
}

export interface TestCompletedResponse {
  completed: true;
  result: ArchetypeCode;
}

export interface ResultResponse {
  personalityType: PersonalityType;
  traitScores: TraitScore[];
  answers: Answer[];
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AnswerRequest {
  questionId: number;
  selectedOption: AnswerValue;
}
