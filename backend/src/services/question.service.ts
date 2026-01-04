import path from 'path';
import fs from 'fs';
import type { Question } from '../../../shared/types/index.js';

function loadQuestions(): Question[] {
  const dataPath = path.join(__dirname, '../data/questions.json');
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data) as Question[];
}

const questionsData: Question[] = loadQuestions();

export class QuestionService {
  private questions: Question[];

  constructor() {
    this.questions = questionsData;
  }

  getAll(): Question[] {
    return this.questions;
  }

  getById(id: number): Question | null {
    const question = this.questions.find((q) => q.id === id);
    return question || null;
  }

  getCurrent(currentIndex: number): Question | null {
    if (currentIndex < 0 || currentIndex >= this.questions.length) {
      return null;
    }
    return this.questions[currentIndex] || null;
  }

  getTotalCount(): number {
    return this.questions.length;
  }

  isValidQuestionId(id: number): boolean {
    return id >= 1 && id <= this.questions.length;
  }
}

export const questionService = new QuestionService();
