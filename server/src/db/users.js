import knex from './';

/**
 * Query for user by identifer of email and/or username
 * @param {string} email
 * @param {string} username If one argument passed, then used as identifer for login.
 * Otherwise, used as seperate email and password
 * @returns user with encrypted password and id
 */
export async function getUser(email, username = email) {
  let user;
  try {
    user = await knex('user')
      .first('encrypted', 'user.id')
      .innerJoin('email', 'user.id', '=', 'email.user_id')
      .innerJoin('user_password', 'user.id', '=', 'user_password.user_id')
      .where('username', '=', username)
      .orWhere('email', '=', email);
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
