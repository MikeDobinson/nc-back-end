const { fetchCommentsOnArticle } = require('../models/comments.models');
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
