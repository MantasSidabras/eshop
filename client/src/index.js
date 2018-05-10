import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import ProductStore from './stores/ProductStore';
import UserStore from './stores/UserStore';

import './globalStyles.css';
import App from './App';

ReactDOM.render(
  <Provider 
    productStore={ProductStore}
    userStore={UserStore}
  >
    <App />
  </Provider>,
  document.getElementById('root'));