import request from 'supertest';
import { app } from '../../src/index';

describe('Album API - Database Integration', () => {
  let albumId: string;

  const newAlbum = {
    "title": "The Dark Side of the Moon",
    "artist": "Pink Floyd",
    "rating": 5,
    "acquiredDate": "2023-10-15",
    "isBorrowed": false,
    "owner": "Elain"
  };

  test('should create an album and return Location header', async () => {
    const res = await request(app)
      .post('/api/v1/albums')
      .send(newAlbum)
      .expect(201);

    const location = res.header['location'];
    albumId = location;
    expect(albumId).toBeDefined();
  });

  test('should retrieve an album by valid ID', async () => {
    const res = await request(app)
      .get(`/api/v1/albums/${albumId}`)
      .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.title).toBe(newAlbum.title);
    expect(res.body.artist).toBe(newAlbum.artist);
    expect(res.body.rating).toBe(newAlbum.rating);
    expect(res.body.isBorrowed).toBe(newAlbum.isBorrowed);
    expect(res.body.owner).toBe(newAlbum.owner);
  });

  test('should return 404 for valid ObjectId format but non-existent document', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app)
      .get(`/api/v1/albums/${fakeId}`)
      .expect(404);

    expect(res.text).toContain('Unable to find matching document');
  });

  test('should return 400 for invalid ObjectId format', async () => {
    const invalidId = 'invalid-id-format';
    const res = await request(app)
      .get(`/api/v1/albums/${invalidId}`)
      .expect(400);

    expect(res.text).toContain('Invalid album id format');
  });

  test('should retrieve all albums', async () => {
    const res = await request(app)
      .get('/api/v1/albums')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('should reject album creation with validation errors', async () => {
    const invalidAlbum = {
      "title": "",  // Empty title should fail
      "artist": "Pink Floyd",
      "rating": 6,  // Rating out of range
      "acquiredDate": "invalid-date",
      "isBorrowed": false
    };

    const res = await request(app)
      .post('/api/v1/albums')
      .send(invalidAlbum)
      .expect(400);

    expect(res.body).toHaveProperty('error', 'Validation failed');
    expect(res.body).toHaveProperty('details');
  });
});
