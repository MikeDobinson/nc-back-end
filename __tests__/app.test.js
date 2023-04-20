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
            comment_count: expect.any(String),
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
  describe('PATCH', () => {
    it('200: returns with the updated article object ', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { article } }) => {
          const { votes } = article;
          expect(votes).toBe(101);
        });
    });
    it('400: wrong data type', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'one' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('404: if given an ID that is not yet assigned to a review', () => {
      return request(app)
        .patch('/api/articles/999')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    });
    it('400: if given an invalid ID', () => {
      return request(app)
        .patch('/api/articles/one')
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('200: returns with the updated article object with no change if no inc_votes is sent', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(200)
        .then(({ body: { article } }) => {
          const { votes } = article;
          expect(votes).toBe(100);
        });
    });
    it('400: if given an object with the wrong value type', () => {
      return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 'one' })
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
  describe('QUERIES', () => {
    describe('topic', () => {
      it('200: returns an array of article objects where all topics match an input', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).not.toBe(0);
            articles.forEach((article) => {
              expect(article.topic).toBe('mitch');
            });
          });
      });
      it('404: returns an error if the topic does not exist', () => {
        return request(app)
          .get('/api/articles?topic=one')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Articles not found');
          });
      });
    });
    describe('order', () => {
      it('200: can change order of sort', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('created_at', {
              ascending: true,
            });
          });
      });
      it('400: if anything other than ASC or DESC are input', () => {
        return request(app)
          .get('/api/articles?order=one')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
          });
      });
    });
    describe('sort_by', () => {
      it('200: can change sort_by column', () => {
        return request(app)
          .get('/api/articles?sort_by=votes')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('votes', {
              descending: true,
            });
          });
      });
      it('400: if anything other than a valid column is input', () => {
        return request(app)
          .get('/api/articles?sort_by=one')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request');
          });
      });
    });
    describe('multiple queries', () => {
      it('200: can handle multiple queries at once', () => {
        return request(app)
          .get('/api/articles?sort_by=votes&order=asc&topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy('votes', {
              ascending: true,
            });
            articles.forEach((article) => {
              expect(article.topic).toBe('mitch');
            });
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
  describe('POST', () => {
    it('200: succesful post', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ username: 'butter_bridge', body: 'test comment' })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: 'test comment',
            article_id: 1,
            author: 'butter_bridge',
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    it('400: if trying to post to an article ID of invalid type', () => {
      return request(app)
        .post('/api/articles/one/comments')
        .send({ username: 'butter_bridge', body: 'test comment' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('404: if trying to post to an article ID that does not exist yet', () => {
      return request(app)
        .post('/api/articles/999/comments')
        .send({ username: 'butter_bridge', body: 'test comment' })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    });
    it('400: if trying to post a comment in the wrong format', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ body: 'test comment' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('400: if trying to post a comment with a username that does not exist', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({ username: 'one', body: 'test comment' })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('200: ignores any additional properties in the request body', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          username: 'butter_bridge',
          body: 'test comment',
          hotel: 'trivago',
        })
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: 'test comment',
            article_id: 1,
            author: 'butter_bridge',
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
  });
});

describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    it('204: deletes the relevant comment from the table', () => {
      return request(app)
        .delete('/api/comments/3')
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        })
        .then(() => {
          return connection.query(
            `SELECT * FROM comments WHERE comment_id = 3`
          );
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(0);
        });
    });
    it('404: if given a comment ID that does not exist', () => {
      return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Comment not found');
        });
    });
    it('400: if given a comment ID of invalid type', () => {
      return request(app)
        .delete('/api/comments/one')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});

describe('/api/users', () => {
  describe('GET', () => {
    it('200: returns an array of all users that match the correct user object', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toBeArray();
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              avatar_url: expect.any(String),
              name: expect.any(String),
            });
          });
        });
    });
  });
});
