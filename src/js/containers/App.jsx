import React from 'react';
import {Match, BrowserRouter as Router} from 'react-router';

import {Home} from '../pages/';

const App = () => {
  return (
    <Router>
      <main>
        <Match
          exactly pattern='/'
          render={Home}
        />
      </main>
    </Router>
  );
};

export default App;
