import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import './env';
import users from './routes/users';

const app = express();
const PORT = 3001;

app.use(cors('*'));
app.use(bodyParser.json());

app.use('/api/users/', users);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
