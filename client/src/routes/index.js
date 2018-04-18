import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import NavBar from '../components/NavBar';
import Register from './Register';
import Home from './Home';
import Login from './Login';
import Communities from './Communities';
import CreateCommunity from './CreateCommunity';

const Routes = () => (
  <BrowserRouter>
    <React.Fragment>
      <NavBar />
      <Container>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/communities" component={Communities} />
          <Route exact path="/create-community" component={CreateCommunity} />
          <Redirect to="/" />
        </Switch>
      </Container>
    </React.Fragment>
  </BrowserRouter>
);

export default Routes;
