import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import models from './models';

const app = express();
const PORT = 3001;

const users = [{ id: 1, name: 'Bob' }, { id: 2, name: 'Billy' }, { id: 3, name: 'Bobby' }];

app.use(cors('*'));
app.use(bodyParser.json());

app.get('/users/', async (req, res) => {
  res.json(users);
  // const response = await models.User.findAll();
  // console.log(response.dataValues);
  // res.json(response.dataValues);
});

app.post('/users/', async (req, res) => {
  if (!req.body || !req.body.username || req.body.username === '') {
    res.sendStatus(400);
  } else {
    const newUser = {
      id: users.length + 1,
      name: req.body.username,
    };

    users.push(newUser);
    res.json(newUser);
  }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

// models.sequelize.sync({}).then(() => {
//   app.listen(PORT);
// });
