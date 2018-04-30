import { Router } from 'express';

import knex from '../db';
import { getCommunityById } from '../db/community';
import { getPostById } from '../db/post';

const router = Router();

/**
 * NOTE: We want to perform DB constraint checks before any actions
 *       because SQL driver doesn't send back error messages nicely
 *
 */

/**
 * Request query:
 *    filter?: string pattern match filter on post body or title
 *
 * Response body:
 *    posts?: Array of posts of id, poster's username, poster's id, title, and body
 */
router.get('/', async (req, res) => {
  try {
    // Get all posts and join with user table to get poster's username
    // Left join with image_post table to find any posts with images
    // (and keep posts that don't have records in image_post)
    // Left join to get all comments for posts and count number of comments
    const postsQuery = knex('post')
      .select(
        'post.id',
        'community_id as communityId',
        'post.title',
        'post.body',
        'username as poster',
        'post.created_at as createdAt',
        'url',
      )
      .innerJoin('user', 'poster_id', '=', 'user.id')
      .leftJoin('image_post', 'post.id', '=', 'image_post.post_id')
      .leftJoin('comment', 'post.id', '=', 'comment.post_id')
      .groupBy('post.id')
      .count('comment.comment_id as commentsCount')
      .orderBy('post.created_at', 'desc');

    // If there was a filter passed, do a string pattern match query on title and body
    if (req.query.filter) {
      postsQuery
        .where('post.title', 'like', `%${req.query.filter}%`)
        .orWhere('post.body', 'like', `%${req.query.filter}%`);
    }

    return res.json({ posts: await postsQuery });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * Request params:
 *    postId: id of post the comments belong to
 *
 * Response body:
 *    post?: Either no postId was specified or no post with postId was found
 */
router.get('/:postId/comments', async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).json({ post: 'No post specified' });
  }

  // Make sure the post exists
  const post = await getPostById(req.params.postId);

  if (!post) {
    return res.status(404).json({ post: 'No post found' });
  }

  // Query from comment table where post_id is passed postId
  try {
    const comments = await knex('comment')
      .select(
        'comment_id as commentId',
        'post_id as postId',
        'user.username',
        'body',
        'comment.created_at as createdAt',
      )
      .where('post_id', '=', req.params.postId)
      .innerJoin('user', 'user.id', '=', 'user_id');

    return res.status(200).json({ comments });
  } catch (err) {
    // Some system error occured
    console.log(err);
    return res.sendStatus(500);
  }
});

router.get('/:postId', async (req, res) => {
  if (!req.params.postId) {
    return res.status(400).json({ postId: 'No post specified' });
  }

  try {
    const post = await getPostById(req.params.postId);

    return res.json({ post });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * Request params:
 *    communityId: id of community the post will belong to
 *
 * Request body:
 *    title: title of post
 *    body: body of post
 *    url?: image url
 *    type: type of image
 *
 * Response body
 *    post: post just created
 */
router.post('/:communityId', async (req, res) => {
  // Client sent a bad request
  if (!req.body) {
    return res.sendStatus(400);
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

    // If an image url exists in the request, insert post into image_post table
    if (req.body.url) {
      await knex('image_post').insert({
        post_id: postId,
        url: req.body.url,
        type: 'image',
      });
    }

    return res.status(200).json({ post: await getPostById(postId) });
  } catch (err) {
    // Some system error occurred
    console.log(err);
    return res.sendStatus(500);
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
    return res.sendStatus(400);
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

    if (post.url !== req.body.url) {
      await knex('image_post')
        .where('post_id', '=', req.params.postId)
        .update({
          url: req.body.url,
        });
    }

    return res.sendStatus(200);
  } catch (err) {
    // Some system error occurred
    console.log(err);
    return res.sendStatus(500);
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
    return res.sendStatus(500);
  }

  // Delete was successful
  return res.sendStatus(200);
});

export default router;
