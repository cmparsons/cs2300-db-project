import React from 'react';
import { Provider } from 'mobx-react';

import Routes from './routes';
import stores from './stores';

const App = () => (
  <Provider {...stores}>
    <Routes />
  </Provider>
);

export default App;
