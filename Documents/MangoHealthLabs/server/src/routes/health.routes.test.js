import request from 'supertest';
import { app } from '../app.js';

test('health endpoint returns a success envelope', async () => {
  const response = await request(app).get('/api/health');
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toHaveProperty('database');
});
