import { Router } from 'express';

import knex from '../db';
import { getMessageById } from '../db/messages';
import { getUserByUsername } from '../db/users';

const router = Router();

/**
 * NOTE: We want to perform DB constraint checks before any actions
 *       because SQL driver doesn't send back error messages nicely
 *
 */

/**
 * Response body:
 *    messages?: Array of messages with receiver_id as userId in token payload
 */
router.get('/inbox', async (req, res) => {
  try {
    // Get all the user's messages and join with users table to get sender and receiver username
    const messages = await knex('message')
      .select(
        'message.id',
        'user1.username as receiver',
        'user2.username as sender',
        'message.body',
        'message.created_at as createdAt',
      )
      .where('receiver_id', req.payload.userId)
      .innerJoin('user as user1', 'receiver_id', '=', 'user1.id')
      .innerJoin('user as user2', 'sender_id', '=', 'user2.id')
      .orderBy('message.created_at', 'desc');

    return res.json({ messages });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * Response body:
 *    messages?: Array of messages with sender_id as userId in token payload
 */
router.get('/sent', async (req, res) => {
  try {
    // Get all the user's sent messages and join with users table to get sender
    // and receiver username
    const messages = await knex('message')
      .select(
        'message.id',
        'user1.username as receiver',
        'user2.username as sender',
        'message.body',
        'message.created_at as createdAt',
      )
      .where('sender_id', req.payload.userId)
      .innerJoin('user as user1', 'receiver_id', '=', 'user1.id')
      .innerJoin('user as user2', 'sender_id', '=', 'user2.id')
      .orderBy('message.created_at', 'desc');

    return res.json({ messages });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * Request params:
 *    username: username of the receiver of the message
 *
 * Request body:
 *    body: body of message
 *
 * Response body
 *    user: error message for username param
 *    body: error message for body
 *    message: newly created message
 */
router.post('/', async (req, res) => {
  // Client sent a bad request
  if (!req.body) {
    return res.sendStatus(400);
  }

  // Check to make sure the receiver exists
  const receiver = await getUserByUsername(req.body.receiver);

  if (!receiver) {
    return res.status(404).json({ user: 'No user found' });
  }

  // Check to make sure the body is not null. Send error message if null
  if (!req.body.body) {
    return res.status(400).json({ body: 'Body is required' });
  }

  // Insert into the message table
  try {
    const [messageId] = await knex('message').insert({
      sender_id: req.payload.userId,
      receiver_id: receiver.id,
      body: req.body.body,
    });

    return res.status(200).json({ message: await getMessageById(messageId) });
  } catch (err) {
    // Some system error occurred
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * Request params:
 *      messageId - id of message to delete
 *
 */
router.delete('/:messageId', async (req, res) => {
  try {
    await knex('message')
      .where('id', req.params.messageId)
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
