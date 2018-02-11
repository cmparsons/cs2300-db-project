import express from 'express';
import bcrypt from 'bcrypt';

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

export default router;
