export const validateRegister = (username, email, password) => {
  const errors = {};
  if (username === '') {
    errors.username = 'Username is required';
  }

  if (email === '') {
    errors.email = 'Email is required';
  }

  if (password === '') {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateLogin = (identifier, password) => {
  const errors = {};

  if (identifier === '') {
    errors.identifier = 'Username/email is required';
  }

  if (password === '') {
    errors.password = 'Password is required';
  }

  return errors;
};
