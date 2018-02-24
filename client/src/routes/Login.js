import React from 'react';
import { Container } from 'semantic-ui-react';
import { inject } from 'mobx-react';

import LoginForm from '../components/LoginForm';

const Login = ({ history, userStore }) => (
  <Container text>
    <LoginForm history={history} userStore={userStore} />
  </Container>
);

export default inject('userStore')(Login);
