import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Register from './Register';
import Home from './Home';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/register" component={Register} />
    </Switch>
  </BrowserRouter>
);
