import knex from './';

/**
 * Query for a post by its id
 * @param {string | number} postId id of post
 * @returns post if the post can be found. Otherwise, returns undefined
 */
export async function getPostById(postId) {
  let post;
  try {
    post = await knex('post')
      .first(
        'post.id',
        'community_id as communityId',
        'title',
        'body',
        'username as poster',
        'post.created_at as createdAt',
      )
      .where('post.id', postId)
      .innerJoin('user', 'poster_id', 'user.id');
  } catch (err) {
    console.log(err);
  }
  return post;
}

export const dummy = {};
