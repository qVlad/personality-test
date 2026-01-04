import type { TraitCode } from './personality.js';

export interface TraitWeight {
  trait: TraitCode;
  weight: number; // positive = increases trait, negative = decreases
}

export interface QuestionOption {
  text: string;
  traits: TraitWeight[];
}

export interface Question {
  id: number;
  text: string;
  options: [QuestionOption, QuestionOption];
}

// For backward compatibility with answer storage
export type AnswerValue = 'A' | 'B';
