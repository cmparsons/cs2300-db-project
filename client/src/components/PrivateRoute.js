import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

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
