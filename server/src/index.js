import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import './env';
import models from './models';

const app = express();
const PORT = 3001;

app.use(cors('*'));
app.use(bodyParser.json());

app.get('/api/users/', async (req, res) => {
  const users = await models.User.findAll({ raw: true });
  res.json(users);
});

app.post('/api/users/', async (req, res) => {
  if (!req.body || !req.body.username || req.body.username === '') {
    res.sendStatus(400);
  } else {
    const newUser = {
      username: req.body.username,
    };

    const response = await models.User.create(newUser);
    res.json(response.dataValues);
  }
});

models.sequelize.sync({}).then(() => {
  app.listen(PORT);
});
