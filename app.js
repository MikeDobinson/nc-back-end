const express = require('express');
const app = express();
const { getAllTopics } = require('./1-controllers/topics.controllers');

app.get('/api/topics', getAllTopics);

module.exports = app;
