import knex from './';

/**
 * Query for community by id
 * @param communityId id of community
 * @returns community if the community can be found. Otherwise, returns undefined
 */
export async function getCommunityById(communityId) {
  let community;
  try {
    community = await knex('community')
      .first(
        'community.id as id',
        'username as creator',
        'creator_id as creatorId',
        'community.name',
      )
      .where('community.id', '=', communityId)
      .innerJoin('user', 'creator_id', '=', 'user.id')
      .leftJoin('post', 'community.id', '=', 'post.community_id')
      .groupBy('community.id')
      .count('post.id as postCount');
  } catch (err) {
    console.log(err);
  }
  return community;
}

export const dummy = {};
