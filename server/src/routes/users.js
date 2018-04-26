import { Router } from 'express';
import bcrypt from 'bcrypt';

import knex from '../db';
import { createToken } from '../utils/auth';

const router = Router();

/**
 *  NOTE: We want to perform DB constraint checks before any actions
 *        because SQL driver doesn't send back error messages nicely
 */

/**
 *
 * @param {string} email
 * @param {string} username If one argument passed, then used as identifer for login.
 * Otherwise, used as seperate email and password
 */
async function getUser(email, username = email) {
  const user = await knex('user')
    .join('email', 'user.id', '=', 'email.user_id')
    .join('user_password', 'user.id', '=', 'user_password.user_id')
    .first('encrypted', 'user.id')
    .where('username', username)
    .orWhere('email', email);

  return user;
}

/**
 * Create a new user by:
 * 1. Inserting username into the user table
 * 2. Inserting email into the email table
 * 3. Inserting the hashed password into the user_password table
 */
router.post('/register', async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const { username, email, password } = req.body;

  try {
    const user = await getUser(email, username);

    if (!user) {
      const encrypted = await bcrypt.hash(password, 10);

      // Insert user into the user table
      const [userId] = await knex('user').insert({ username });

      // Insert user's email and password in to the email and user_password tables
      Promise.all([
        knex('email').insert({ user_id: userId, email }),
        knex('user_password').insert({ user_id: userId, encrypted }),
      ]);

      return res.json({ token: await createToken(userId) });
    }
    return res.status(400).json({ email: 'Email not unique', username: 'Username not unique' });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

/**
 * 1. Join user, email, and user_password tables to find user based
 *    on username or email
 * 2. Compare passwords
 * 3. Return access token if login procedure succeeds. Otherwise, return any errors
 */
router.post('/login', async (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const { identifier, password } = req.body;

  // Find first user that matches the email or username
  const user = await getUser(identifier);

  if (!user) {
    return res.status(400).json({ identifier: 'Invalid username/email' });
  }
  const match = await bcrypt.compare(password, user.encrypted);

  if (!match) {
    return res.status(400).json({ password: 'Invalid password' });
  }
  return res.json({ token: await createToken(user.id) });
});

router.get('/me', async (req, res) => {
  try {
    const user = await knex('user')
      .join('email', 'user.id', '=', 'email.user_id')
      .join('user_password', 'user.id', '=', 'user_password.user_id')
      .first('email', 'username', 'id')
      .where('user.id', req.payload.userId);

    if (!user) {
      return res.sendStatus(404);
    }
    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

export default router;
