const express = require('express');
const app = express();
const { getAllTopics } = require('./1-controllers/topics.controllers');

app.get('/api/topics', getAllTopics);

app.get('/*', (req, res, next) => {
  res.status(404).send({ msg: 'Page not found' });
});

module.exports = app;
