import React from 'react';
import { Provider } from 'mobx-react';

import Routes from './routes';
import UserStore from './stores/UserStore';

const App = () => (
  <Provider userStore={UserStore}>
    <Routes />
  </Provider>
);

export default App;
