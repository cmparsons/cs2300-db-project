import express from 'express';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import models from '../models';
import { createToken } from '../utils/auth';
import formatErrors from '../utils/formatErrors';

const router = express.Router();

router.post('/', async (req, res) => {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    const { username, email, password } = req.body;

    try {
      const encrypted = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        email,
        password: encrypted,
      };

      const response = await models.User.create(newUser, { raw: true });
      res.json({ token: await createToken(response, process.env.APP_SECRET) });
    } catch (err) {
      const errors = formatErrors(err, models);
      res.status(400).json({ errors });
    }
  }
});

router.post('/login', async (req, res) => {
  if (!req.body) {
    res.sendStatus(400);
  } else {
    const { identifier, password } = req.body;

    const user = await models.User.findOne({
      [Op.or]: [{ username: identifier }, { email: identifier }],
      raw: true,
    });

    if (!user) {
      res
        .status(404)
        .json({ path: 'identifier', message: 'User with that email/username does not exist' });
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(400).json({ path: 'password', message: 'Invalid password' });
      } else {
        res.json({ token: await createToken(user, process.env.APP_SECRET) });
      }
    }
  }
});

export default router;
