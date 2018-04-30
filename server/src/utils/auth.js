import jsonwebtoken from 'jsonwebtoken';
import jwt from 'express-jwt';

const APP_SECRET =
  process.env.APP_SECRET || 'la;sjdlaskdjfopiquwepqorela;sdfaldfz,.cmnvzc,xvnal;sdfowpqeuls;dkz,';

/**
 * Get the token from the authorization header
 * @param {Request} req HTTP request objet
 * @return token from the authorization header if it exists. Othwerise, returns null
 */
function getTokenFromHeader(req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

export const auth = {
  required: jwt({
    secret: APP_SECRET,
    userProperty: 'payload',
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret: APP_SECRET,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

/**
 * Create an access token with the userId signed into then token
 * @param {number} userId id of user
 * @returns signed access token
 */
export function createToken(userId) {
  const accessToken = jsonwebtoken.sign(
    {
      userId,
    },
    process.env.APP_SECRET,
    {
      expiresIn: '1y',
    },
  );

  return accessToken;
}
