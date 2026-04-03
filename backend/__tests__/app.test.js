const request = require('supertest');
const app = require('../app');

describe('Health routes', () => {
    it('GET /api/hello should return 200 and a message', async () => {
        const res = await request(app).get('/api/hello');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Hello from the backend!');
    });
});