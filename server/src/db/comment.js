import knex from './';

/**
 * Query for a comment by its id
 * @param {string | number} commentId id of post
 * @returns post if the post can be found. Otherwise, returns undefined
 */
export async function getCommentById(commentId) {
  let comment;
  try {
    comment = await knex('comment')
      .first(
        'comment_id',
        'post_id',
        'body',
        'username as poster',
        'comment.created_at as createdAt',
      )
      .where('comment.comment_id', commentId)
      .innerJoin('user', 'comment.user_id', 'user.id');
  } catch (err) {
    console.log(err);
  }
  return comment;
}

export const dummy = {};
