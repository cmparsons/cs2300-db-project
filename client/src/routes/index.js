import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import PrivateRoute from '../components/PrivateRoute';
import NavBar from '../components/NavBar';
import AlertMessageList from '../components/AlertMessages/AlertMessageList';
import Register from './Register';
import Home from './Home';
import Login from './Login';
import Communities from './Communities';
import CreateCommunity from './CreateCommunity';
import PostEditor from './PostEditor';
import Post from './Post';
import Inbox from './Inbox';

const Routes = () => (
  <BrowserRouter>
    <React.Fragment>
      <NavBar />
      <Container>
        <AlertMessageList />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/community/:communityId" component={Home} />
          <Route exact path="/community/:communityId/:postId" component={Post} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/communities" component={Communities} />
          <PrivateRoute exact path="/create-community" component={CreateCommunity} />
          <PrivateRoute exact path="/post-editor/:communityId/:postId?" component={PostEditor} />
          <PrivateRoute exact path="/inbox" component={Inbox} />
          <Redirect to="/" />
        </Switch>
      </Container>
    </React.Fragment>
  </BrowserRouter>
);

export default Routes;
