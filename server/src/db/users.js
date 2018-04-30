import knex from './';

/**
 * Query for user by credentials (array of emails or username)
 * @param {string[]} emails array of emails
 * @param {string} username user's username
 * @returns user with encrypted password and id
 */
export async function getUser(emails, username) {
  let user;
  try {
    user = await knex('user')
      .first('encrypted', 'user.id')
      .innerJoin('email', 'user.id', '=', 'email.user_id')
      .innerJoin('user_password', 'user.id', '=', 'user_password.user_id')
      .where('username', '=', username)
      .orWhereIn('email', emails);
  } catch (err) {
    console.log(err);
  }

  return user;
}

/**
 * Query for user by identifer (username or email)
 * @param {string} identifier Username or email of user
 * @returns user with encrypted password and id
 */
export async function getUserByIdentifier(identifer) {
  let user;
  try {
    user = await knex('user')
      .first('encrypted', 'user.id')
      .innerJoin('email', 'user.id', '=', 'email.user_id')
      .innerJoin('user_password', 'user.id', '=', 'user_password.user_id')
      .where('username', '=', identifer)
      .orWhere('email', '=', identifer);
  } catch (err) {
    console.log(err);
  }

  return user;
}

/**
 * Query for user by username
 * @param {string} username username of user to query (is unquie)
 */
export async function getUserByUsername(username) {
  let user;
  try {
    user = await knex('user')
      .first('user.id', 'username')
      .where('username', '=', username);
  } catch (err) {
    console.log(err);
  }

  return user;
}
