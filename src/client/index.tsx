/**
 * ************************************
 *
 * @module  index.tsx
 * @author Zahara Aviv
 * @date
 * @description entry point for application.
 *
 * ************************************
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
// opt-in to webpack hot module
// if (module.hot) module.hot.accept();
// package scss style sheets
import './scss/application.scss';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('contents') as Element
);
