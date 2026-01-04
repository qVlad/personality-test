import { Router, Request, Response } from 'express';
import { sessionService } from '../services/session.service.js';
import { questionService } from '../services/question.service.js';
import { answerService } from '../services/answer.service.js';
import { AppError } from '../middleware/errorHandler.js';
import type { QuestionResponse, ErrorResponse } from '../../../shared/types/index.js';

const router = Router();

// GET /api/questions/current - Get current question
router.get('/current', (req: Request, res: Response<QuestionResponse | ErrorResponse>) => {
  const sessionId = req.session.testSessionId;

  if (!sessionId) {
    throw new AppError('No active session found', 404);
  }

  const session = sessionService.getById(sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.status === 'completed') {
    throw new AppError('Test already completed', 400);
  }

  const question = questionService.getCurrent(session.currentQuestion);

  if (!question) {
    throw new AppError('Question not found', 404);
  }

  // Check if there's a previous answer for this question
  const previousAnswer = answerService.getBySessionAndQuestion(sessionId, question.id);

  res.json({
    question,
    currentIndex: session.currentQuestion,
    totalQuestions: questionService.getTotalCount(),
    previousAnswer: previousAnswer?.selectedOption || null,
  });
});

// GET /api/questions/:id - Get specific question by ID
router.get('/:id', (req: Request, res: Response<QuestionResponse | ErrorResponse>) => {
  const sessionId = req.session.testSessionId;

  if (!sessionId) {
    throw new AppError('No active session found', 404);
  }

  const session = sessionService.getById(sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  const questionId = parseInt(req.params.id!, 10);

  if (isNaN(questionId) || !questionService.isValidQuestionId(questionId)) {
    throw new AppError('Question not found', 404);
  }

  // Check if question is accessible (user must have answered all previous questions)
  // Question is accessible if its index (id - 1) <= currentQuestion
  const questionIndex = questionId - 1;

  if (questionIndex > session.currentQuestion) {
    throw new AppError('Question not yet accessible', 400);
  }

  const question = questionService.getById(questionId);

  if (!question) {
    throw new AppError('Question not found', 404);
  }

  // Check if there's a previous answer for this question
  const previousAnswer = answerService.getBySessionAndQuestion(sessionId, questionId);

  res.json({
    question,
    currentIndex: questionIndex,
    totalQuestions: questionService.getTotalCount(),
    previousAnswer: previousAnswer?.selectedOption || null,
  });
});

export default router;
