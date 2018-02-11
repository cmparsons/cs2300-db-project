import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import './env';
import models from './models';
import users from './routes/users';

const app = express();
const PORT = 3001;

app.use(cors('*'));
app.use(bodyParser.json());

app.use('/api/users/', users);

models.sequelize.sync({}).then(() => {
  app.listen(PORT);
});
