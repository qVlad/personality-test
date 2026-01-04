import request from 'supertest';
import { app } from '../../src/index';
import { initTestDatabase, closeDatabase, resetDatabase } from '../../src/services/database';

describe('Result API', () => {
  beforeAll(() => {
    initTestDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    resetDatabase();
  });

  describe('GET /api/result', () => {
    it('should return 404 when no session exists', async () => {
      const response = await request(app)
        .get('/api/result')
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return 400 when test is not completed', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      const response = await agent.get('/api/result').expect(400);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return personality type after test completion', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      // Answer all questions with specific pattern for ESTJ
      const answers = [
        'E', 'E', 'E', 'E', 'E', // EI -> E
        'S', 'S', 'S', 'S', 'S', // SN -> S
        'T', 'T', 'T', 'T', 'T', // TF -> T
        'J', 'J', 'J', 'J', 'J', // JP -> J
      ];

      for (let i = 0; i < 20; i++) {
        await agent
          .post('/api/answers')
          .send({ questionId: i + 1, selectedPole: answers[i] })
          .expect(200);
      }

      const response = await agent.get('/api/result').expect(200);

      expect(response.body).toMatchObject({
        personalityType: {
          code: 'ESTJ',
          name: expect.any(String),
          description: expect.any(String),
          strengths: expect.arrayContaining([expect.any(String)]),
          growthAreas: expect.arrayContaining([expect.any(String)]),
        },
        answers: expect.arrayContaining([
          { questionId: expect.any(Number), selectedPole: expect.any(String) },
        ]),
      });
    });

    it('should return all 20 answers', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      // Answer all questions
      for (let i = 1; i <= 20; i++) {
        await agent
          .post('/api/answers')
          .send({ questionId: i, selectedPole: 'E' })
          .expect(200);
      }

      const response = await agent.get('/api/result').expect(200);

      expect(response.body.answers).toHaveLength(20);
    });

    it('should calculate INFP correctly', async () => {
      const agent = request.agent(app);

      await agent.post('/api/session').expect(200);

      // Answer pattern for INFP
      const answers = [
        'I', 'I', 'I', 'I', 'I', // EI -> I
        'N', 'N', 'N', 'N', 'N', // SN -> N
        'F', 'F', 'F', 'F', 'F', // TF -> F
        'P', 'P', 'P', 'P', 'P', // JP -> P
      ];

      for (let i = 0; i < 20; i++) {
        await agent
          .post('/api/answers')
          .send({ questionId: i + 1, selectedPole: answers[i] })
          .expect(200);
      }

      const response = await agent.get('/api/result').expect(200);

      expect(response.body.personalityType.code).toBe('INFP');
    });
  });
});
