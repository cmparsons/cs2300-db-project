import jwt from 'jsonwebtoken';

export const createToken = async (userId, secret) => {
  const accessToken = jwt.sign(
    {
      userId,
    },
    secret,
    {
      expiresIn: '1h',
    },
  );

  return accessToken;
};

export default { createToken };
