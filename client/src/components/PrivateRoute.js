import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

/**
 * Taken and modified from React Router docs:
 * https://reacttraining.com/react-router/web/example/auth-workflow
 *
 * If the user is authenticated and exists, render the desired component.
 * Otherwise, redirect to homepage.
 */
const PrivateRoute = ({
  component: Component,
  authStore: { isAuthenticated },
  userStore: { user },
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (isAuthenticated && user ? <Component {...props} /> : <Redirect to="/" />)}
  />
);

export default inject('authStore', 'userStore')(observer(PrivateRoute));
