import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import NavBar from '../components/NavBar';
import Register from './Register';
import Home from './Home';
import Login from './Login';

const Routes = () => (
  <BrowserRouter>
    <div>
      <NavBar />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Redirect to="/" />
        </Switch>
      </main>
    </div>
  </BrowserRouter>
);

export default Routes;
