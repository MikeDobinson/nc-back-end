const db = require('../db/connection');

exports.fetchCommentsOnArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1
    ORDER BY created_at DESC
    `,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};
