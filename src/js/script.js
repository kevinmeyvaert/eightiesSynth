import React from 'react';
import {render} from 'react-dom';
import {App} from './containers/';

const init = () => {

  render(
    <App />,
    document.querySelector(`.container`)
  );

};

init();
