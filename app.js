const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controllers');
const {
  getAllArticles,
  getArticleById,
  patchArticleById,
} = require('./controllers/articles.controllers');
const {
  getCommentsOnArticle,
  postNewCommentOnArticle,
  deleteCommentById,
} = require('./controllers/comments.controllers');
const {
  handleCustomErrors,
  handleServerErrors,
  handlePsqlErrors,
} = require('./controllers/errors.controllers');
const { getAllUsers } = require('./controllers/users.controllers');
const { getApi } = require('./controllers/api.controllers');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/topics', getAllTopics);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsOnArticle);
app.get('/api/users', getAllUsers);
app.get('/api', getApi);

app.post('/api/articles/:article_id/comments', postNewCommentOnArticle);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/*', (req, res) => {
  res.status(404).send({ msg: 'Page not found' });
});
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
