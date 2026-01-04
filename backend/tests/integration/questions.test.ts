import request from 'supertest';
import { app } from '../../src/index';
import { initTestDatabase, closeDatabase, resetDatabase } from '../../src/services/database';

describe('Questions API', () => {
  beforeAll(() => {
    initTestDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    resetDatabase();
  });

  describe('GET /api/questions/current', () => {
    it('should return 404 when no session exists', async () => {
      const response = await request(app)
        .get('/api/questions/current')
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return first question for new session', async () => {
      const agent = request.agent(app);

      // Create session
      await agent.post('/api/session').expect(200);

      // Get current question
      const response = await agent.get('/api/questions/current').expect(200);

      expect(response.body).toMatchObject({
        question: {
          id: 1,
          text: expect.any(String),
          options: expect.arrayContaining([
            { text: expect.any(String), pole: expect.any(String) },
            { text: expect.any(String), pole: expect.any(String) },
          ]),
        },
        currentIndex: 0,
        totalQuestions: 20,
        previousAnswer: null,
      });
    });

    it('should return 400 when test is completed', async () => {
      const agent = request.agent(app);

      // Create session and complete the test
      await agent.post('/api/session').expect(200);

      // Answer all 20 questions
      for (let i = 1; i <= 20; i++) {
        await agent
          .post('/api/answers')
          .send({ questionId: i, selectedPole: 'E' })
          .expect(200);
      }

      // Try to get current question
      const response = await agent.get('/api/questions/current').expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });
  });

  describe('GET /api/questions/:id', () => {
    it('should return 404 when no session exists', async () => {
      const response = await request(app)
        .get('/api/questions/1')
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return question by ID with previous answer', async () => {
      const agent = request.agent(app);

      // Create session and answer first question
      await agent.post('/api/session').expect(200);
      await agent
        .post('/api/answers')
        .send({ questionId: 1, selectedPole: 'E' })
        .expect(200);

      // Get question 1 again
      const response = await agent.get('/api/questions/1').expect(200);

      expect(response.body).toMatchObject({
        question: { id: 1 },
        currentIndex: 0,
        totalQuestions: 20,
        previousAnswer: 'E',
      });
    });

    it('should return 400 for question not yet accessible', async () => {
      const agent = request.agent(app);

      // Create session
      await agent.post('/api/session').expect(200);

      // Try to access question 5 without answering previous questions
      const response = await agent.get('/api/questions/5').expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 404 for invalid question ID', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      // Question 21 doesn't exist
      await agent.get('/api/questions/21').expect(404);

      // Question 0 doesn't exist
      await agent.get('/api/questions/0').expect(404);
    });
  });
});
