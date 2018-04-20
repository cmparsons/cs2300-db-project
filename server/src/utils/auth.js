import jwt from 'jsonwebtoken';
// import jwt from 'express-jwt';
// import knex from '../db';

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

/**
 * Pass userId into the payload from the token if token exists and valid
 * @param {Request} req HTTP request object
 * @param {Response} res HTTP response object
 * @param {next} next HTTP next function
 */
export async function auth(req, res, next) {
  const token = getTokenFromHeader(req);

  if (token) {
    try {
      const { userId } = await jwt.verify(token, process.env.APP_SECRET);
      req.userId = userId;
      next();
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

/**
 * Create an access token with the userId signed into then token
 * @param {number} userId id of user
 * @returns signed access token
 */
export function createToken(userId) {
  const accessToken = jwt.sign(
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
