import React from 'react';
import { Form, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('authStore')
@observer
export default class Register extends React.Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.props.authStore.clearErrors();

    switch (name) {
      case 'username': {
        this.props.authStore.setUsername(value);
        break;
      }
      case 'email': {
        this.props.authStore.setPrimaryEmail(value);
        break;
      }
      case 'email2': {
        this.props.authStore.setAdditionalEmail(value);
        break;
      }
      case 'password': {
        this.props.authStore.setPassword(value);
        break;
      }
      default:
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    // Make POST request to server to register user
    await this.props.authStore.register();
  };

  render() {
    const {
      errors,
      isLoading,
      username,
      password,
      emails,
      errorList,
      hasError,
    } = this.props.authStore;

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
          error={hasError}
          loading={isLoading}
        >
          <Form.Input
            fluid
            name="username"
            label="Username"
            placeholder="Username"
            value={username}
            autoComplete="off"
            error={hasError && !!errors.username}
            onChange={this.handleChange}
          />
          <Form.Input
            fluid
            type="email"
            name="email"
            label="Email"
            placeholder="Email"
            value={emails[0]}
            autoComplete="off"
            error={hasError && !!errors.email}
            onChange={this.handleChange}
          />
          <Form.Input
            fluid
            type="email"
            name="email2"
            label="Additional Email"
            placeholder="Email"
            value={emails[1]}
            autoComplete="off"
            error={hasError && !!errors.email}
            onChange={this.handleChange}
          />
          <Form.Input
            fluid
            name="password"
            type="password"
            label="Password"
            placeholder="Password"
            value={password}
            error={hasError && !!errors.password}
            onChange={this.handleChange}
          />
          <Form.Button color="blue">Submit</Form.Button>
          {hasError && (
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
