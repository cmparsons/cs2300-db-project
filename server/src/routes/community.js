import { Router } from 'express';

import knex from '../db';

const router = Router();

/**
 * NOTE: We want to perform DB constraint checks before any actions
 *       because SQL driver doesn't send back error messages nicely
 *
 */

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
      .innerJoin('user', 'creator_id', '=', 'user.id');

    return res.json({ communities });
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
 *    communityId?: id of the community
 *    name?: Error message for the name field
 */
router.post('/', async (req, res) => {
  // Client sent a bad request
  if (!req.body) {
    return res.status(400);
  }

  // Check to make sure the name is not null. Send error message if null
  if (!req.body.name) {
    return res.status(400).json({ name: 'Community name required' });
  }

  // Insert into the community table
  try {
    const [communityId] = await knex('community').insert({
      creator_id: req.userId,
      name: req.body.name,
    });

    return res.status(200).json({ communityId });
  } catch (err) {
    // Some system error occurred
    console.log(err);
    return res.status(500);
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
    return res.status(500);
  }

  // Delete was successful
  return res.status(200).end();
});

export default router;
