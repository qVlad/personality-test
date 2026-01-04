import { Router, Request, Response } from 'express';
import { sessionService } from '../services/session.service.js';
import { AppError } from '../middleware/errorHandler.js';
import type { SessionResponse, ErrorResponse } from '../../../shared/types/index.js';

const router = Router();
const TOTAL_QUESTIONS = 20;

// POST /api/session - Start or resume session
router.post('/', (req: Request, res: Response<SessionResponse>) => {
  // Check if session already exists
  const existingSessionId = req.session.testSessionId;

  if (existingSessionId) {
    const existingSession = sessionService.getById(existingSessionId);
    if (existingSession) {
      res.json({
        id: existingSession.id,
        currentQuestion: existingSession.currentQuestion,
        status: existingSession.status,
        totalQuestions: TOTAL_QUESTIONS,
        result: existingSession.result,
      });
      return;
    }
  }

  // Create new session
  const session = sessionService.create();
  req.session.testSessionId = session.id;

  res.json({
    id: session.id,
    currentQuestion: session.currentQuestion,
    status: session.status,
    totalQuestions: TOTAL_QUESTIONS,
    result: session.result,
  });
});

// GET /api/session - Get current session state
router.get('/', (req: Request, res: Response<SessionResponse | ErrorResponse>) => {
  const sessionId = req.session.testSessionId;

  if (!sessionId) {
    throw new AppError('No active session found', 404);
  }

  const session = sessionService.getById(sessionId);

  if (!session) {
    throw new AppError('Session not found', 404);
  }

  res.json({
    id: session.id,
    currentQuestion: session.currentQuestion,
    status: session.status,
    totalQuestions: TOTAL_QUESTIONS,
    result: session.result,
  });
});

// DELETE /api/session - Reset session
router.delete('/', (req: Request, res: Response<SessionResponse>) => {
  const oldSessionId = req.session.testSessionId;

  // Delete old session if exists
  if (oldSessionId) {
    sessionService.delete(oldSessionId);
  }

  // Create new session
  const session = sessionService.create();
  req.session.testSessionId = session.id;

  res.json({
    id: session.id,
    currentQuestion: session.currentQuestion,
    status: session.status,
    totalQuestions: TOTAL_QUESTIONS,
    result: session.result,
  });
});

export default router;
