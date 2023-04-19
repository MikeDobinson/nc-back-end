const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controllers');
const {
  getAllArticles,
  getArticleById,
} = require('./controllers/articles.controllers');
const { getCommentsOnArticle } = require('./controllers/comments.controllers');
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require('./controllers/errors.controllers');

app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsOnArticle);

app.get('/*', (req, res) => {
  res.status(404).send({ msg: 'Page not found' });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
