import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';

import { validateLogin } from '../utils/validation';

export default class LoginForm extends React.Component {
  state = {
    identifier: '',
    password: '',
    isSubmitting: false,
    errors: {},
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value, errors: {} });
  };

  handleSubmit = async (e) => {
    const { identifier, password } = this.state;

    this.setState({ isSubmitting: true });
    e.preventDefault();

    // Make sure all fields are filled in
    const clientErrors = validateLogin(identifier, password);
    if (!isEmpty(clientErrors)) {
      this.setState({ errors: clientErrors, isSubmitting: false });
      return;
    }

    // Make POST request if client validation passes
    try {
      const response = await axios.post('/api/users/login', {
        identifier,
        password,
      });

      // If we receive an OK status from server, login user with token
      if (response.status === 200) {
        this.props.userStore.setToken(response.data.token);
        this.props.history.push('/');
      }
    } catch (err) {
      console.log(err);
      const serverErrors = {};
      const { path, message } = err.response.data;
      serverErrors[path] = message;
      this.setState({ errors: serverErrors, isSubmitting: false });
    }
  };

  render() {
    const {
      identifier, password, isSubmitting, errors,
    } = this.state;

    const errorList = [];
    Object.keys(errors).forEach((key) => {
      errorList.push(errors[key]);
    });

    return (
      <Form
        className="attached fluid segment"
        onSubmit={this.handleSubmit}
        error={errorList.length > 0}
        loading={isSubmitting}
      >
        <Form.Input
          fluid
          name="identifier"
          label="Username/Email"
          placeholder="Username/Email"
          value={identifier}
          autoComplete="off"
          error={!!errors.identifier}
          onChange={this.handleChange}
        />
        <Form.Input
          fluid
          name="password"
          type="password"
          label="Password"
          placeholder="Password"
          value={password}
          error={!!errors.password}
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
