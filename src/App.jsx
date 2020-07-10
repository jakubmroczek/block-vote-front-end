import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Page from './Page.jsx';

/* eslint "react/react-in-jsx-scope": "off" */

const element = (
  <Router>
    <Page />
  </Router>
);

ReactDOM.render(element,
  document.getElementById('contents'));

if (module.hot) {
  module.hot.accept();
}
