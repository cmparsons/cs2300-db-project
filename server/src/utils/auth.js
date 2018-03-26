import jwt from 'jsonwebtoken';
// import pick from 'lodash/pick';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

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

  // const createRefreshToken = jwt.sign(
  //   {
  //     user: pick(user, 'id'),
  //   },
  //   secret2,
  //   {
  //     expiresIn: '7d',
  //   },
  // );
  return accessToken;

  // return [createToken, createRefreshToken];
};

export const refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId = 0;
  try {
    const { user: { id } } = jwt.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createToken(user, SECRET, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (identifier, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({
    where: {
      [Op.or]: [{ username: identifier }, { email: identifier }],
    },
  });
  if (!user) {
    // user with provided identifier not found
    return {
      ok: false,
      errors: [{ path: 'identifier', message: 'Invalid' }],
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    return {
      ok: false,
      errors: [{ path: 'password', message: 'Invalid' }],
    };
  }

  // const refreshTokenSecret = user.password + SECRET2;
  const token = await createToken(user, SECRET);

  // const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

  return {
    ok: true,
    token,
  };
};
