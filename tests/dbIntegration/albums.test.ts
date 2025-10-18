import request from 'supertest';
import { app } from '../../src/index';

describe('Album API', () => {
  let albumId: string;
  
  const newAlbum = {
     "title": "The Dark Side of the Moon",
      "artist": "Pink Floyd",
      "rating": 5,
      "acquiredDate": "2023-10-15",
      "isBorrowed": false,
      "owner": "Elain",
      "silly": "this is not just silly but dangerous"
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
});
