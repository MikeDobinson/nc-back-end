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

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    it('200: returns an object with the correct KV pairs', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
          });
        });
    });
    it('404: returns with error if an unassigned article ID is entered', () => {
      return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    });
    it('400: returns error if impossible article ID is entered', () => {
      return request(app)
        .get('/api/articles/one')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});
