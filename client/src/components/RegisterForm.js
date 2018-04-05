import React from 'react';
import { Form, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import { inject, observer } from 'mobx-react';

import { validateRegister } from '../utils/validation';

const defaultState = {
  username: '',
  email: '',
  password: '',
};

@inject('authStore')
@observer
export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentWillUnmount() {
    this.props.authStore.clearErrors();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.props.authStore.clearErrors();

    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    const { username, email, password } = this.state;
    const { authStore } = this.props;

    e.preventDefault();

    // Make sure all fields are filled in
    const clientErrors = validateRegister(username, email, password);
    if (!isEmpty(clientErrors)) {
      authStore.setErrors(clientErrors);
      return;
    }

    // Make POST request to server to register user
    await authStore.register(username, email, password);
  };

  render() {
    const { username, email, password } = this.state;

    const { errors, isLoading } = this.props.authStore;

    const errorList = isEmpty(errors) ? [] : values(errors);

    return (
      <React.Fragment>
        <Message
          attached
          header="Welcome to our site!"
          content="Fill out the form below to sign-up for a new account"
        />
        <Form
          className="attached fluid segment"
          onSubmit={this.handleSubmit}
          error={errorList.length > 0}
          loading={isLoading}
        >
          <Form.Input
            fluid
            name="username"
            label="Username"
            placeholder="Username"
            value={username}
            autoComplete="off"
            error={errors && !!errors.username}
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
            error={errors && !!errors.email}
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
          <Form.Button color="blue">Submit</Form.Button>
          {errorList.length > 0 && (
            <Message error header="There was some errors with your submission" list={errorList} />
          )}
        </Form>
        <Message attached="bottom" warning>
          <Icon name="help" />
          Already signed up?&nbsp;<Link to="/login">Login here</Link>&nbsp;instead.
        </Message>
      </React.Fragment>
    );
  }
}
