import { Router, Request, Response } from 'express';
import { sessionService } from '../services/session.service.js';
import { answerService } from '../services/answer.service.js';
import { personalityService } from '../services/personality.service.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ResultResponse, ErrorResponse } from '../../../shared/types/index.js';

const router = Router();

// GET /api/result - Get test result
router.get('/', (req: Request, res: Response<ResultResponse | ErrorResponse>) => {
  const sessionId = req.session.testSessionId;

  if (!sessionId) {
    throw new AppError('No active session found', 404);
  }

  const session = sessionService.getById(sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.status !== 'completed' || !session.result) {
    throw new AppError('Test not yet completed', 400);
  }

  const personalityType = personalityService.getByCode(session.result);

  if (!personalityType) {
    throw new AppError('Personality type not found', 500);
  }

  const answers = answerService.getBySession(sessionId);

  res.json({
    personalityType,
    answers,
  });
});

export default router;
