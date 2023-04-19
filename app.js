const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controllers');
const { getArticleById } = require('./controllers/articles.controllers');

app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticleById);

app.get('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Page not found' });
});

module.exports = app;
