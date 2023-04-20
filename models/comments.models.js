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

exports.createCommentOnArticle = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *`,
      [article_id, username, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = ($1)`, [comment_id])
    .then(({ rows }) => rows);
};

exports.checkCommentExists = (commentId) => {
  console.log('we are checking');
  return db
    .query(`SELECT * FROM comments WHERE comment_id = ($1)`, [commentId])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: 'No comment found with that ID',
        });
      }
    });
};
