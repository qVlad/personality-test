import type { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

const VALID_OPTIONS = ['A', 'B'];

export function validateAnswerRequest(req: Request, _res: Response, next: NextFunction): void {
  const { questionId, selectedOption } = req.body;

  // Validate questionId
  if (questionId === undefined || questionId === null) {
    throw new AppError('questionId is required', 400);
  }

  if (typeof questionId !== 'number' || !Number.isInteger(questionId)) {
    throw new AppError('questionId must be an integer', 400);
  }

  if (questionId < 1 || questionId > 24) {
    throw new AppError('questionId must be between 1 and 24', 400);
  }

  // Validate selectedOption
  if (!selectedOption) {
    throw new AppError('selectedOption is required', 400);
  }

  if (typeof selectedOption !== 'string') {
    throw new AppError('selectedOption must be a string', 400);
  }

  if (!VALID_OPTIONS.includes(selectedOption)) {
    throw new AppError(`selectedOption must be one of: ${VALID_OPTIONS.join(', ')}`, 400);
  }

  next();
}

export function validateQuestionId(req: Request, _res: Response, next: NextFunction): void {
  const { id } = req.params;

  if (!id) {
    throw new AppError('Question ID is required', 400);
  }

  const questionId = parseInt(id, 10);

  if (isNaN(questionId)) {
    throw new AppError('Question ID must be a number', 400);
  }

  if (questionId < 1 || questionId > 24) {
    throw new AppError('Question ID must be between 1 and 24', 400);
  }

  next();
}
