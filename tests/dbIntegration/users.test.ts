import request from 'supertest';
import { app } from '../../src/index';

describe('User API', () => {
  let userId: string;
  
  const newUser = {
      "name": "Una",
      "phonenumber": "0871234567",
      "email": "john.doe@mymail.ie",
      "dob": "2001/01/12",
      "silly": "this is not just silly but dangerous"
    };

  test('should create a user and return Location header', async () => {
    

    const res = await request(app)
      .post('/api/v1/users')
      .send(newUser)
      .expect(201);

    const location = res.header['location'];

    userId = location;
    expect(userId).toBeDefined();
  }); 
});
