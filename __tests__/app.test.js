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

describe('api/articles', () => {
  describe('GET', () => {
    it('200: returns an array of article objects ', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeArray();
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article).toBeObject();
            expect(article).toHaveProperty('article_id');
            expect(article).toHaveProperty('title');
            expect(article).toHaveProperty('topic');
            expect(article).toHaveProperty('author');
            expect(article).toHaveProperty('body');
            expect(article).toHaveProperty('created_at');
            expect(article).toHaveProperty('votes');
            expect(article).toHaveProperty('article_img_url');
            expect(article).toHaveProperty('comment_count');
          });
        });
    });
    it('200: returns an array of article objects with the correct default sort order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
  });
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    it('200: returns an array of comments sorted by created_at in desc order', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeArray();
          expect(comments).toBeSortedBy('created_at', {
            descending: true,
          });
          comments.forEach((comment) => {
            expect(comment).toBeObject();
            expect(comment).toHaveProperty('comment_id');
            expect(comment).toHaveProperty('author');
            expect(comment).toHaveProperty('article_id');
            expect(comment).toHaveProperty('votes');
            expect(comment).toHaveProperty('created_at');
            expect(comment).toHaveProperty('body');
          });
        });
    });
    it('200: an empty array if no comments assigned to an existing review', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeArray();
          expect(comments.length).toBe(0);
        });
    });
    it('404: returns an error if an unassigned article ID is entered', () => {
      return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    });
    it('400: returns an error if an impossible article ID is entered', () => {
      return request(app)
        .get('/api/articles/one/comments')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});
