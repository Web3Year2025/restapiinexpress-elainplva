import request from 'supertest';
import { app } from '../../src/index';
import { initDb, closeDb, collections } from '../../src/database';

// Test the Album API endpoints
describe('Album API', () => {

  // Connect to the database before all tests
  beforeAll(async () => {
    await initDb();
  });

  // Close the database connection after all tests
  afterAll(async () => {
    await closeDb();
  });

  // ── GET /api/v1/albums ─────────────────────────────────────────────
  describe('GET /api/v1/albums', () => {

    it('should return 200 and an array of albums', async () => {
      const response = await request(app).get('/api/v1/albums');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

  });

  // ── GET /api/v1/albums/search ──────────────────────────────────────
  describe('GET /api/v1/albums/search', () => {

    it('should return 200 and results when given a valid query', async () => {
      const response = await request(app)
        .get('/api/v1/albums/search?query=karma');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 400 when no query is provided', async () => {
      const response = await request(app)
        .get('/api/v1/albums/search');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Search query is required');
    });

  });

  // ── GET /api/v1/albums/:id ─────────────────────────────────────────
  describe('GET /api/v1/albums/:id', () => {

    it('should return 400 for an invalid id format', async () => {
      const response = await request(app)
        .get('/api/v1/albums/not-a-valid-id');

      expect(response.status).toBe(400);
    });

  });

  // ── POST /api/v1/albums ────────────────────────────────────────────
  describe('POST /api/v1/albums', () => {

    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .post('/api/v1/albums')
        .send({
          title: 'Test Album',
          artist: 'Test Artist',
          acquiredDate: '2026-01-01',
          isBorrowed: false
        });

      // Protected route — must return 401 without a token
      expect(response.status).toBe(401);
    });

  });

});