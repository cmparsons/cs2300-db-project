import { Router } from 'express';

import knex from '../db';

const router = Router();

/**
 * NOTE: We want to perform DB constraint checks before any actions
 *       because SQL driver doesn't send back error messages nicely
 *
 */

/**
 * Query for community by id
 * @param communityId id of community
 * @returns community if the community can be found. Otherwise, returns undefined
 */
async function getCommunityById(communityId) {
  let community;
  try {
    community = await knex('community')
      .first()
      .where('id', communityId);
  } catch (err) {
    console.log(err);
  }
  return community;
}

/**
 * Query for a post by its id
 * @param {string | number} postId id of post
 * @returns post if the post can be found. Otherwise, returns undefined
 */
async function getPostById(postId) {
  let post;
  try {
    post = await knex('post')
      .first()
      .where('id', postId);
  } catch (err) {
    console.log(err);
  }
  return post;
}

router.get('/:postId', async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).json({ postId: 'No post specified' });
  }

  try {
    const post = await knex('post')
      .first(
        'post.id',
        'community_id as communityId',
        'title',
        'body',
        'username as poster',
        'post.created_at as createdAt',
      )
      .where('post.id', req.params.postId)
      .innerJoin('user', 'poster_id', '=', 'user.id');

    return res.json({ post });
  } catch (err) {
    console.log(err);
    return res.status(500);
  }
});

/**
 * Request body:
 *    name: Name of the community
 *
 * Response body
 *    postId?: id of the post
 *    title?: Error message for the title field
 *    body?: Error message for the body field
 *    communityId?: Error message for the communityId field
 */
router.post('/:communityId', async (req, res) => {
  // Client sent a bad request
  if (!req.body) {
    return res.status(400);
  }

  // Check to make sure the communityId is not null. Send error message if null
  if (!req.params.communityId) {
    return res.status(400).json({ communityId: 'No community specified' });
  }

  // Check to make sure the community exists
  const community = await getCommunityById(req.params.communityId);

  if (!community) {
    return res.status(404).json({ communityId: 'No community found' });
  }

  // Check to make sure the title is not null. Send error message if null
  if (!req.body.title) {
    return res.status(400).json({ title: 'Title is required' });
  }

  // Check to make sure the body is not null. Send error message if null
  if (!req.body.body) {
    return res.status(400).json({ body: 'Body is required' });
  }

  // Insert into the post table
  try {
    const [postId] = await knex('post').insert({
      poster_id: req.payload.userId,
      community_id: req.params.communityId,
      title: req.body.title,
      body: req.body.body,
    });

    return res.status(200).json({ postId });
  } catch (err) {
    // Some system error occurred
    console.log(err);
    return res.status(500);
  }
});

/**
 * Request params:
 *    postId: id of post to update
 *
 * Request body:
 *    title: title of post (could be unchanged)
 *    body: title of body (could be unchanged)
 *
 * Response body
 *    title?: Error message for the title field
 *    body?: Error message for the body field
 *    postId?: Error message for the postId field
 */
router.put('/:postId', async (req, res) => {
  // Client sent a bad request
  if (!req.body) {
    return res.status(400).end();
  }

  // Check to make sure the postId is not null. Send error message if null
  if (!req.params.postId) {
    return res.status(400).json({ postId: 'No community specified' });
  }

  // Check to make sure the post exists
  const post = await getPostById(req.params.postId);

  if (!post) {
    return res.status(404).json({ postId: 'No post found' });
  }

  // Check to make sure the title is not null. Send error message if null
  if (!req.body.title) {
    return res.status(400).json({ title: 'Title is required' });
  }

  // Check to make sure the body is not null. Send error message if null
  if (!req.body.body) {
    return res.status(400).json({ body: 'Body is required' });
  }

  // Update post in the post table
  try {
    await knex('post')
      .where('id', '=', req.params.postId)
      .update({
        title: req.body.title,
        body: req.body.body,
      });

    return res.status(200).end();
  } catch (err) {
    // Some system error occurred
    console.log(err);
    return res.status(500).end();
  }
});
/**
 * Request params:
 *      postId - id of post to delete
 *
 */
router.delete('/:postId', async (req, res) => {
  try {
    await knex('post')
      .where('id', req.params.postId)
      .del();
  } catch (err) {
    // Some system error occured
    console.log(err);
    return res.status(500);
  }

  // Delete was successful
  return res.status(200).end();
});

export default router;
