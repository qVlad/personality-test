import request from 'supertest';
import { app } from '../../src/index';
import { initTestDatabase, closeDatabase, resetDatabase } from '../../src/services/database';

describe('Session API', () => {
  beforeAll(() => {
    initTestDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    resetDatabase();
  });

  describe('POST /api/session', () => {
    it('should create a new session', async () => {
      const response = await request(app)
        .post('/api/session')
        .expect(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        currentQuestion: 0,
        status: 'in_progress',
        totalQuestions: 20,
        result: null,
      });
    });

    it('should return existing session if one exists', async () => {
      // Create first session
      const agent = request.agent(app);
      const first = await agent.post('/api/session').expect(200);

      // Request again - should return same session
      const second = await agent.post('/api/session').expect(200);

      expect(second.body.id).toBe(first.body.id);
    });

    it('should set session cookie', async () => {
      const response = await request(app)
        .post('/api/session')
        .expect(200);

      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('GET /api/session', () => {
    it('should return 404 when no session exists', async () => {
      const response = await request(app)
        .get('/api/session')
        .expect(404);

      expect(response.body).toMatchObject({
        error: expect.any(String),
        message: expect.any(String),
      });
    });

    it('should return existing session state', async () => {
      const agent = request.agent(app);

      // Create session first
      await agent.post('/api/session').expect(200);

      // Get session state
      const response = await agent.get('/api/session').expect(200);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        currentQuestion: 0,
        status: 'in_progress',
        totalQuestions: 20,
      });
    });
  });

  describe('DELETE /api/session', () => {
    it('should reset session and create new one', async () => {
      const agent = request.agent(app);

      // Create session
      const first = await agent.post('/api/session').expect(200);

      // Reset session
      const reset = await agent.delete('/api/session').expect(200);

      // Should have new session ID
      expect(reset.body.id).not.toBe(first.body.id);
      expect(reset.body.currentQuestion).toBe(0);
      expect(reset.body.status).toBe('in_progress');
    });
  });
});
