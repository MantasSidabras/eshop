import { observable, action, decorate, computed } from 'mobx';

import AuthApi from '../api/AuthApi';
import UserApi from '../api/UserApi';
import CartProductApi from '../api/CartProductApi';
import UserStore from '../stores/UserStore';
import Config from '../api/Config';

class CartStore {
  cartProductList = [];

  getCart = () => {
    const token = AuthApi.getDecodedToken();
    if (!token || !AuthApi.isTokenValid()) return;

    return fetch(Config.url + `/user/${token.id}/cartProduct`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    })
      .then(res => {
        if(res.status === 401){
          throw new Error('failed to authenticate user');
        } else{
          return res;
        }
      })
      .then(res => res.json())
      .then(cart => this.cartProductList = cart)
  }

  clearCart = () => this.cartProductList = [];

  get sum() {
    return this.cartProductList.reduce((total, cp) => total += cp.quantity * cp.product.price, 0).toFixed(2);
  }

  get allProductCount() {
    return this.cartProductList.reduce((total, cp) => total += cp.quantity, 0);
  }
  
  addCartProductByProductId = productId => {
    if (!UserStore.isLoggedIn) {
      // TODO: somehow add product when not logged in
      return Promise.reject(new Error('Please login again'));
    }

    return CartProductApi.add(productId)
      .then(res => this.getCart())
  }

  updateCartProduct = cartProduct => {
    this.error = false;
    return CartProductApi.update(cartProduct)
      .then(res => this.getCart())
  }

  deleteCartProductById = id => {
    return CartProductApi.deleteById(id)
      .then(res => this.getCart())
      .catch(error => console.error(error))
  }

  deleteAll = () => {
    const token = AuthApi.getDecodedToken();
    if (!token) return;

    return UserApi.deleteAllCartProducts(token.id)
      .then(res => this.getCart())
      .catch(error => console.error(error))
  }
}

decorate(CartStore, {
  cartProductList: observable,
  sum: computed,
  allProductCount: computed,
  getCart: action,
  clearCart: action,
  addCartProductByProductId: action,
  updateCartProduct: action,
  deleteCartProductById: action,
  deleteAll: action
})

export default new CartStore();
