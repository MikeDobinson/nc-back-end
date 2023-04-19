const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controllers');
const { getArticleById } = require('./controllers/articles.controllers');
const { handleCustomErrors } = require('./controllers/errors.controllers');

app.use(express.json());

app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticleById);

app.get('/*', (req, res) => {
  res.status(404).send({ msg: 'Page not found' });
});

app.use(handleCustomErrors);

module.exports = app;
