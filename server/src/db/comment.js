import knex from './';

/**
 * Query for a comment by its id
 * @param {string | number} commentId id of comment
 * @returns comment if the comment can be found. Otherwise, returns undefined
 */
export async function getCommentById(commentId) {
  let comment;
  try {
    comment = await knex('comment')
      .first(
        'comment_id as commentId',
        'post_id as postId',
        'body',
        'username',
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
