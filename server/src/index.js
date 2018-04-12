import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';

import './env';
import users from './routes/users';
import community from './routes/community';

const app = express();
const PORT = 3001;

app.use(logger('dev')); // Nice logging for HTTP requests
app.use(cors('*')); // Allow any domain to access the resources on our endpoint (not practical for production)
app.use(bodyParser.json()); // Parse body of requests to JSON format
app.use(bodyParser.urlencoded({ extended: false }));

// Declare endpoint routes
app.use('/api/users/', users);
app.use('/api/community/', community);

// Start server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
