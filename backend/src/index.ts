import express from 'express';
import cors from 'cors';
import { createSessionMiddleware } from './middleware/session.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { initDatabase } from './services/database.js';
import sessionRoutes from './api/session.routes.js';
import questionsRoutes from './api/questions.routes.js';
import answersRoutes from './api/answers.routes.js';
import resultRoutes from './api/result.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(createSessionMiddleware());

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/session', sessionRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/answers', answersRoutes);
app.use('/api/result', resultRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize database and start server
if (process.env.NODE_ENV !== 'test') {
  initDatabase();
  app.listen(PORT, () => {
    console.error(`Server running on http://localhost:${PORT}`);
  });
}

export { app };
