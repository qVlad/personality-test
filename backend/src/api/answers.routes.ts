import { Router, Request, Response } from 'express';
import { sessionService } from '../services/session.service.js';
import { questionService } from '../services/question.service.js';
import { answerService } from '../services/answer.service.js';
import { scoringService } from '../services/scoring.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { validateAnswerRequest } from '../middleware/validation.js';
import type {
  AnswerRequest,
  QuestionResponse,
  TestCompletedResponse,
  ErrorResponse,
  AnswerValue,
} from '../../../shared/types/index.js';

const router = Router();
const TOTAL_QUESTIONS = 24;

// POST /api/answers - Submit an answer
router.post(
  '/',
  validateAnswerRequest,
  (req: Request, res: Response<QuestionResponse | TestCompletedResponse | ErrorResponse>) => {
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

    const { questionId, selectedOption } = req.body as AnswerRequest;

    // Validate questionId
    if (!questionId || !questionService.isValidQuestionId(questionId)) {
      throw new AppError('Invalid question ID', 400);
    }

    // Validate selectedOption
    if (!selectedOption || !scoringService.isValidAnswerValue(selectedOption)) {
      throw new AppError('Invalid option value', 400);
    }

    // Check if this is the current question or a previously answered question
    const currentQuestionId = session.currentQuestion + 1;

    // Allow answering current question or any previous question (for going back)
    if (questionId > currentQuestionId) {
      throw new AppError('Cannot answer future questions', 400);
    }

    // Submit the answer
    answerService.submit(sessionId, questionId, selectedOption as AnswerValue);

    // If answering current question, advance to next
    if (questionId === currentQuestionId) {
      const newCurrentQuestion = session.currentQuestion + 1;

      // Check if test is complete
      if (newCurrentQuestion >= TOTAL_QUESTIONS) {
        // Calculate result
        const answers = answerService.getBySession(sessionId);
        const result = scoringService.calculateArchetype(answers);

        // Update session as completed
        sessionService.update(sessionId, {
          currentQuestion: TOTAL_QUESTIONS,
          status: 'completed',
          result,
        });

        res.json({
          completed: true,
          result,
        });
        return;
      }

      // Update session with new current question
      sessionService.update(sessionId, { currentQuestion: newCurrentQuestion });

      // Return next question
      const nextQuestion = questionService.getCurrent(newCurrentQuestion);

      if (!nextQuestion) {
        throw new AppError('Next question not found', 500);
      }

      res.json({
        question: nextQuestion,
        currentIndex: newCurrentQuestion,
        totalQuestions: TOTAL_QUESTIONS,
        previousAnswer: null,
      });
      return;
    }

    // If updating a previous answer, return the current question
    const currentQuestion = questionService.getCurrent(session.currentQuestion);

    if (!currentQuestion) {
      throw new AppError('Current question not found', 500);
    }

    const previousAnswer = answerService.getBySessionAndQuestion(sessionId, currentQuestion.id);

    res.json({
      question: currentQuestion,
      currentIndex: session.currentQuestion,
      totalQuestions: TOTAL_QUESTIONS,
      previousAnswer: previousAnswer?.selectedOption || null,
    });
  }
);

export default router;
