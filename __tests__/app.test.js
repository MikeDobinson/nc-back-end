const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/');
const connection = require('../db/connection');
const { expect } = require('@jest/globals');

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe('/api/topics', () => {
  it('200: returns an array of topic objects, with each having keys of slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200) // this isn't working - why?
      .then(({ body: { topics } }) => {
        expect(topics).toBeArray();
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toBeObject();
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      });
  });
});

describe('invalid endpoint', () => {
  it('404: returns an error message when given an invalid endpoint', () => {
    return request(app)
      .get('/api/invalid')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Page not found');
      });
  });
});
