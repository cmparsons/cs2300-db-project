import { Router } from 'express';

import knex from '../db';
import { getCommunityById } from '../db/community';

const router = Router();

/**
 * NOTE: We want to perform DB constraint checks before any actions
 *       because SQL driver doesn't send back error messages nicely
 *
 */

// router.get('/:communityId', async (req, res) => {
//   try {
//     const comm = await getCommunityById(req.params.communityId);

//     return res.json({ comm });
//   } catch (err) {
//     console.log(err);
//     return res.status(500);
//   }
// });

router.get('/', async (req, res) => {
  try {
    // Get all communities and join with users to get the username of the creator
    const communities = await knex('community')
      .select(
        'community.id as id',
        'username as creator',
        'creator_id as creatorId',
        'community.name',
      )
      .innerJoin('user', 'creator_id', '=', 'user.id')
      .leftJoin('post', 'community.id', '=', 'post.community_id')
      .groupBy('community.id')
      .count('post.id as postCount');

    return res.json({ communities });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * Request body:
 *    name: Name of the community
 *
 * Response body
 *    communityId?: id of the community
 *    name?: Error message for the name field
 */
router.post('/', async (req, res) => {
  // Client sent a bad request
  if (!req.body) {
    return res.sendStatus(400);
  }

  // Check to make sure the name is not null. Send error message if null
  if (!req.body.name) {
    return res.status(400).json({ name: 'Community name required' });
  }

  // Insert into the community table
  try {
    const [communityId] = await knex('community').insert({
      creator_id: req.payload.userId,
      name: req.body.name,
    });

    return res.status(200).json({ community: await getCommunityById(communityId) });
  } catch (err) {
    // Some system error occurred
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * Request params:
 *      communityId - id of community to delete
 *
 */
router.delete('/:communityId', async (req, res) => {
  try {
    await knex('community')
      .where('id', req.params.communityId)
      .del();
  } catch (err) {
    // Some system error occured
    console.log(err);
    return res.sendStatus(500);
  }

  // Delete was successful
  return res.sendStatus(200);
});

/**
 * Request params:
 *   communityId: id of community
 *
 * Response body:
 *    posts?: Array of posts of id, poster's username, poster's id, title, and body
 */
router.get('/posts/:communityId', async (req, res) => {
  // Check to make sure the communityId is not null. Send error message if null
  if (!req.params.communityId) {
    return res.status(400).json({ communityId: 'No community requested' });
  }

  try {
    // Get all posts and join with user table to get poster's username
    // Left join with image_post table to find any posts with images
    // (and keep posts that don't have records in image_post)
    // Left join to get all comments for posts and count number of comments
    const posts = await knex('post')
      .select(
        'post.id',
        'community_id as communityId',
        'post.title',
        'post.body',
        'username as poster',
        'post.created_at as createdAt',
        'url',
      )
      .where('community_id', req.params.communityId)
      .innerJoin('user', 'poster_id', '=', 'user.id')
      .leftJoin('image_post', 'post_id', '=', 'post.id')
      .leftJoin('comment', 'post.id', '=', 'comment.post_id')
      .groupBy('post.id')
      .count('comment.comment_id as commentsCount')
      .orderBy('post.created_at', 'desc');

    return res.json({ posts });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export default router;
