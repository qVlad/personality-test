import request from 'supertest';
import { app } from '../../src/index';
import { initTestDatabase, closeDatabase, resetDatabase } from '../../src/services/database';

describe('Answers API', () => {
  beforeAll(() => {
    initTestDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    resetDatabase();
  });

  describe('POST /api/answers', () => {
    it('should return 404 when no session exists', async () => {
      const response = await request(app)
        .post('/api/answers')
        .send({ questionId: 1, selectedPole: 'E' })
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should submit answer and return next question', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      const response = await agent
        .post('/api/answers')
        .send({ questionId: 1, selectedPole: 'E' })
        .expect(200);

      expect(response.body).toMatchObject({
        question: { id: 2 },
        currentIndex: 1,
        totalQuestions: 20,
        previousAnswer: null,
      });
    });

    it('should return completed response after last question', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      // Answer questions 1-19
      for (let i = 1; i < 20; i++) {
        await agent
          .post('/api/answers')
          .send({ questionId: i, selectedPole: 'E' })
          .expect(200);
      }

      // Answer last question
      const response = await agent
        .post('/api/answers')
        .send({ questionId: 20, selectedPole: 'J' })
        .expect(200);

      expect(response.body).toMatchObject({
        completed: true,
        result: expect.stringMatching(/^[EI][SN][TF][JP]$/),
      });
    });

    it('should return 400 for invalid pole value', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      const response = await agent
        .post('/api/answers')
        .send({ questionId: 1, selectedPole: 'X' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 400 for invalid question ID', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      const response = await agent
        .post('/api/answers')
        .send({ questionId: 21, selectedPole: 'E' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 400 for answering wrong question', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      // Try to answer question 5 when at question 1
      const response = await agent
        .post('/api/answers')
        .send({ questionId: 5, selectedPole: 'E' })
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should update existing answer when going back', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      // Answer question 1 with E
      await agent
        .post('/api/answers')
        .send({ questionId: 1, selectedPole: 'E' })
        .expect(200);

      // Answer question 2
      await agent
        .post('/api/answers')
        .send({ questionId: 2, selectedPole: 'S' })
        .expect(200);

      // Go back and update question 1 to I
      await agent
        .post('/api/answers')
        .send({ questionId: 1, selectedPole: 'I' })
        .expect(200);

      // Check that answer was updated
      const question = await agent.get('/api/questions/1').expect(200);
      expect(question.body.previousAnswer).toBe('I');
    });
  });
});
