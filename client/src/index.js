import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import ProductStore from './stores/ProductStore';
import UserStore from './stores/UserStore';
import CartStore from './stores/CartStore';

import './globalStyles.css';
import App from './App';

ReactDOM.render(
  <Provider 
    productStore={ProductStore}
    userStore={UserStore}
    cartStore={CartStore}
  >
    <App />
  </Provider>,
  document.getElementById('root'));