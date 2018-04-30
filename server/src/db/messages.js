import knex from './';

/**
 * Query for a message by id
 * @param {number} messageId id of message
 */
export async function getMessageById(messageId) {
  let message;
  try {
    message = await knex('message')
      .select(
        'message.id',
        'user1.username as receiver',
        'user2.username as sender',
        'message.body',
        'message.created_at as createdAt',
      )
      .where('message.id', messageId)
      .innerJoin('user as user1', 'receiver_id', '=', 'user1.id')
      .innerJoin('user as user2', 'sender_id', '=', 'user2.id');
  } catch (err) {
    console.log(err);
  }

  return message;
}

export const dummy = {};
