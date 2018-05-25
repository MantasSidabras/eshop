import { observable, action, decorate, computed } from 'mobx';

import AuthApi from '../api/AuthApi';
import UserApi from '../api/UserApi';
import CartProductApi from '../api/CartProductApi';
import UserStore from '../stores/UserStore';
import Config from '../api/Config';

class CartStore {
  cartProductList = [];

  getCart = () => {
    if (!UserStore.isLoggedIn) {
      if (localStorage.getItem('cart')) {
        this.cartProductList = JSON.parse(localStorage.getItem('cart'));
      }
      return Promise.resolve();
    }

    const token = AuthApi.getDecodedToken();
    if (!token || !AuthApi.isTokenValid()) return;

    return CartProductApi.getAll()
      .then(cart => this.cartProductList = cart)
  }

  get sum() {
    return this.cartProductList.reduce((total, cp) => total += cp.quantity * cp.product.price, 0).toFixed(2);
  }

  get allProductCount() {
    return this.cartProductList.reduce((total, cp) => total += cp.quantity, 0);
  }
  
  addProductToCart = ({ id, name, price }) => {
    if (!UserStore.isLoggedIn) {
      if (this.cartProductList.find(cp => cp.product.id === id)) {
        this.cartProductList.forEach((cp, index) => {
          if (cp.product.id === id) {
            this.cartProductList[index].quantity += 1;
          }
        })
      } else {
        this.cartProductList.push({ id: this.cartProductList.length + 1, product: { id, name, price }, quantity: 1 })
      }

      localStorage.setItem('cart', JSON.stringify(this.cartProductList));
      return;
    }

    CartProductApi.add(id)
      .then(res => this.getCart())
      .catch(error => console.error(error));
  }

  updateCartProduct = cartProduct => {
    this.error = false;
    if (!UserStore.isLoggedIn) {
      this.cartProductList.forEach((cp, index) => {
        if (cp.id === cartProduct.id) {
          this.cartProductList[index].quantity = Number(cartProduct.quantity);
        }
      })

      localStorage.setItem('cart', JSON.stringify(this.cartProductList));
      return Promise.resolve();
    }

    return CartProductApi.update(cartProduct)
      .then(res => this.getCart())
      .catch(error => console.error(error));
  }

  deleteCartProductById = id => {
    if (!UserStore.isLoggedIn) {
      this.cartProductList.forEach((cp, index) => {
        if (cp.id === id) {
          this.cartProductList.splice(index, 1);
        }
      })

      localStorage.setItem('cart', JSON.stringify(this.cartProductList));
      return Promise.resolve();
    }

    return CartProductApi.deleteById(id)
      .then(res => this.getCart())
      .catch(error => console.error(error))
  }

  deleteAll = () => {
    if (!UserStore.isLoggedIn) {
      this.cartProductList = [];

      localStorage.setItem('cart', JSON.stringify(this.cartProductList));
      return Promise.resolve();
    }

    return CartProductApi.deleteAll()
      .then(res => this.getCart())
      .catch(error => console.error(error))
  }

  clearCart = () => {
    if (localStorage.getItem('cart')) {
      localStorage.removeItem('cart')
    }
    
    this.cartProductList = [];
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
