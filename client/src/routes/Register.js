import React from 'react';
import { Container } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import RegisterForm from '../components/RegisterForm';

@inject('authStore')
@observer
export default class Login extends React.Component {
  render() {
    const { authStore: { isAuthenticated } } = this.props;

    return isAuthenticated ? (
      <Redirect to="/" />
    ) : (
      <Container text>
        <RegisterForm />
      </Container>
    );
  }
}
