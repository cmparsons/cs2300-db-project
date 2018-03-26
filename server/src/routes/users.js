import { Router } from 'express';
import bcrypt from 'bcrypt';

import knex from '../db';
import { createToken } from '../utils/auth';

const router = Router();

/**
 * Create a new user by:
 * 1. Inserting username into the user table
 * 2. Inserting email into the email table
 * 3. Inserting the hashed password into the user_password table
 */
router.post('/', async (req, res) => {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    const { username, email, password } = req.body;

    try {
      const encrypted = await bcrypt.hash(password, 10);

      // Insert user into the user table
      const [userId] = await knex('user').insert({ username });

      // Insert user's email and password in to the email and user_password tables
      Promise.all([
        knex('email').insert({ user_id: userId, email }),
        knex('user_password').insert({ user_id: userId, encrypted }),
      ]);

      res.json({ token: await createToken(userId, process.env.APP_SECRET) });
    } catch (err) {
      res.status(400).json(err);
    }
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
    res.sendStatus(400);
  } else {
    const { identifier, password } = req.body;

    // Find first user that matches the email or username
    const user = await knex('user')
      .join('email', 'user.id', '=', 'email.user_id')
      .join('user_password', 'user.id', '=', 'user_password.user_id')
      .first('encrypted', 'user.id')
      .where('username', identifier)
      .orWhere('email', identifier);

    if (!user) {
      res.status(400).json({ identifier: 'Invalid username/email' });
    } else {
      const match = await bcrypt.compare(password, user.encrypted);

      if (!match) {
        res.status(400).json({ password: 'Invalid password' });
      } else {
        res.json({ token: await createToken(user, process.env.APP_SECRET) });
      }
    }
  }
});

export default router;
