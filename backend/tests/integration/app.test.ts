import request from 'supertest';
import { app } from '../../src/index';
import { initTestDatabase, closeDatabase } from '../../src/services/database';

describe('Express App', () => {
  beforeAll(() => {
    initTestDatabase();
  });

  afterAll(() => {
    closeDatabase();
  });

  describe('GET /api/health', () => {
    it('should return status ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toEqual({
        error: 'NotFound',
        message: 'The requested resource was not found',
      });
    });
  });

  describe('CORS', () => {
    it('should include CORS headers', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});
