const {
  fetchCommentsOnArticle,
  createCommentOnArticle,
  removeCommentById,
  checkCommentExists,
} = require('../models/comments.models');
const { fetchArticleById } = require('../models/articles.models');

exports.getCommentsOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(() => {
      return fetchCommentsOnArticle(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postNewCommentOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  fetchArticleById(article_id)
    .then(() => {
      return createCommentOnArticle(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
