import { Router } from 'express';

import knex from '../db';
import { getPostById } from '../db/post';
import { getCommentById } from '../db/comment';

const router = Router();

/**
 *  NOTE: We want to perform DB constraint checks before any actions
 *        because SQL driver doesn't send back error messages nicely
 */

/**
 * Request params:
 *    postId: id of post the comment will belong to
 *
 * Request body:
 *    body: body of comment
 *
 * Response body
 *    comment: comment just created
 */
router.post('/:postId', async (req, res) => {
  // Client sent a bad request
  if (!req.body) {
    return res.sendStatus(400);
  }

  // Check to make sure the postId is not null. Send error message if null
  if (!req.params.postId) {
    return res.status(400).json({ postId: 'No post specified' });
  }

  // Check to make sure the post exists
  const post = await getPostById(req.params.postId);

  if (!post) {
    return res.status(404).json({ postId: 'No post found' });
  }

  // Check to make sure the body is not null. Send error message if null
  if (!req.body.body) {
    return res.status(400).json({ body: 'Body is required' });
  }

  // Insert into the comment table
  try {
    const [commentId] = await knex('comment').insert({
      post_id: req.params.postId,
      user_id: req.payload.userId,
      body: req.body.body,
    });

    return res.status(200).json({ comment: await getCommentById(commentId) });
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
// router.delete('/:commentId', async (req, res) => {
//   try {
//     await knex('comment')
//       .where('comment_id', req.params.commentId)
//       .del();
//   } catch (err) {
//     // Some system error occured
//     console.log(err);
//     return res.sendStatus(500);
//   }

//   // Delete was successful
//   return res.sendStatus(200);
// });

export default router;
