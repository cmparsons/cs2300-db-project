import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { observer, inject } from 'mobx-react';

import { validateLogin } from '../utils/validation';

@inject('authStore')
@observer
export default class LoginForm extends React.Component {
  state = {
    identifier: '',
    password: '',
  };

  componentWillUnmount() {
    this.props.authStore.clearErrors();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.props.authStore.clearErrors();

    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    const { identifier, password } = this.state;
    const { authStore } = this.props;

    e.preventDefault();

    // Make sure all fields are filled in
    const clientErrors = validateLogin(identifier, password);
    if (!isEmpty(clientErrors)) {
      authStore.setErrors(clientErrors);
      return;
    }

    // Make POST request to server to login user
    await authStore.login(identifier, password);
  };

  render() {
    const { identifier, password } = this.state;

    const { errors, isLoading } = this.props.authStore;

    const errorList = isEmpty(errors) ? [] : values(errors);

    return (
      <Form
        className="attached fluid segment"
        onSubmit={this.handleSubmit}
        error={errorList.length > 0}
        loading={isLoading}
      >
        <Form.Input
          fluid
          name="identifier"
          label="Username/Email"
          placeholder="Username/Email"
          value={identifier}
          autoComplete="off"
          error={errors && !!errors.identifier}
          onChange={this.handleChange}
        />
        <Form.Input
          fluid
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          value={password}
          error={errors && !!errors.password}
          onChange={this.handleChange}
        />
        <Form.Button color="blue">Login</Form.Button>
        {errorList.length > 0 && (
          <Message error header="There was some errors with your submission" list={errorList} />
        )}
      </Form>
    );
  }
}
