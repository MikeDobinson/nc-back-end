const { fetchCommentsOnArticle } = require('../models/comments.models');

exports.getCommentsOnArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsOnArticle(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
