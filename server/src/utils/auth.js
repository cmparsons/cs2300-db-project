import jsonwebtoken from 'jsonwebtoken';
import jwt from 'express-jwt';

function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

export const auth = {
  required: jwt({
    secret: process.env.APP_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret: process.env.APP_SECRET,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

export function createToken(userId) {
  const accessToken = jsonwebtoken.sign(
    {
      userId,
    },
    process.env.APP_SECRET,
    {
      expiresIn: '1d',
    },
  );

  return accessToken;
}
