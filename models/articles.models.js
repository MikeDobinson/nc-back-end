const db = require('../db/connection');
const format = require('pg-format');

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT articles.*, count(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id=comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return result.rows[0];
    });
};

exports.fetchAllArticles = (topic, order = 'DESC', sort_by = 'created_at') => {
  const queryParameters = [];
  if (!['ASC', 'DESC', 'asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  if (
    ![
      'article_id',
      'title',
      'topic',
      'author',
      'body',
      'created_at',
      'votes',
      'article_img_url',
      'comment_count',
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  let queryString = `SELECT articles.*, count(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id=comments.article_id `;

  if (topic) {
    queryString += ` WHERE topic = $1 `;
    queryParameters.push(topic);
  }

  queryString += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order};`;

  return db.query(queryString, queryParameters).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: 'Articles not found' });
    } else {
      return rows;
    }
  });
};

exports.editArticleById = (article_id, inc_votes) => {
  if (!inc_votes) inc_votes = 0;

  return db
    .query(
      `UPDATE articles 
      SET votes = votes + $1 
      WHERE article_id = $2 
      RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
