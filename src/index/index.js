import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux'

import 'normalize.css/normalize.css'
import './index.css'
import App from './App.jsx'
import store from './store'

ReactDom.render(
  <Provider store={store}>
      <App/>
  </Provider>
, document.getElementById('root'))