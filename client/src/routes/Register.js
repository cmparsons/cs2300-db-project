import React from 'react';
import { Form, Container, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { inject } from 'mobx-react';

import { validateRegister } from '../utils/validation';

const defaultState = {
  username: '',
  email: '',
  password: '',
  isSubmitting: false,
  errors: {},
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState({ [name]: value, errors: {} });
  };

  handleSubmit = async (e) => {
    const { username, email, password } = this.state;

    this.setState({ isSubmitting: true });
    e.preventDefault();

    // Make sure all fields are filled in
    const clientErrors = validateRegister(username, email, password);
    if (!isEmpty(clientErrors)) {
      this.setState({ errors: clientErrors, isSubmitting: false });
      return;
    }

    // Make POST request if client validation passes
    try {
      const response = await axios.post('/api/users/', {
        username,
        email,
        password,
      });

      // If we receive an OK status from server, login user with token
      if (response.status === 200) {
        this.props.userStore.setToken(response.data.token);
        this.props.history.push('/');
      }
    } catch (err) {
      const serverErrors = {};
      err.response.data.errors.forEach(({ path, message }) => {
        serverErrors[path] = message;
      });

      this.setState({ errors: serverErrors, isSubmitting: false });
    }
  };

  render() {
    const {
      username, email, password, isSubmitting, errors,
    } = this.state;

    const errorList = [];
    Object.keys(errors).forEach((key) => {
      errorList.push(errors[key]);
    });

    return (
      <Container text>
        <Message
          attached
          header="Welcome to our site!"
          content="Fill out the form below to sign-up for a new account"
        />
        <Form
          className="attached fluid segment"
          onSubmit={this.handleSubmit}
          error={errorList.length > 0}
          loading={isSubmitting}
        >
          <Form.Input
            fluid
            name="username"
            label="Username"
            placeholder="Username"
            value={username}
            autoComplete="off"
            error={!!errors.username}
            onChange={this.handleChange}
          />
          <Form.Input
            fluid
            type="email"
            name="email"
            label="Email"
            placeholder="Email"
            value={email}
            autoComplete="off"
            error={!!errors.email}
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
          <Form.Button color="blue">Submit</Form.Button>
          {errorList.length > 0 && (
            <Message error header="There was some errors with your submission" list={errorList} />
          )}
        </Form>
        <Message attached="bottom" warning>
          <Icon name="help" />
          Already signed up?&nbsp;<Link to="/login">Login here</Link>&nbsp;instead.
        </Message>
      </Container>
    );
  }
}

export default inject('userStore')(Register);
