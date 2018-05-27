import { observable, action, decorate, computed } from 'mobx';

import AuthApi from '../api/AuthApi';
import UserApi from '../api/UserApi';
import CartProductApi from '../api/CartProductApi';
import UserStore from '../stores/UserStore';
import Config from '../api/Config';

class CartStore {
  cartProductList = [];

  get sum() {
    return this.cartProductList.reduce((total, cp) => total += cp.quantity * cp.product.price, 0).toFixed(2);
  }

  get allProductCount() {
    return this.cartProductList.reduce((total, cp) => total += cp.quantity, 0);
  }

  getCart = () => {
    if (!UserStore.isLoggedIn) {
      const cart = localStorage.getItem('cart');

      if (cart) {
        this.cartProductList = JSON.parse(cart);
      } else {
        this.cartProductList = [];
      }

      return Promise.resolve();
    }

    if (!AuthApi.isTokenValid()) {
      return;
    }

    return CartProductApi.getAll()
      .then(cart => this.cartProductList = cart.reverse())
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
      return Promise.resolve();
    }

    return CartProductApi.add(id)
      .then(newCp => {
        if (this.cartProductList.find(cp => cp.id === newCp.id)) {
          this.cartProductList.forEach((cp, index) => {
            if (cp.id === newCp.id) {
              this.cartProductList[index] = newCp;
            }
          })
        } else {
          this.cartProductList.push(newCp)
        }
      })
  }

  updateCartProduct = cartProduct => {
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
      .then(updatedCp => {
        this.cartProductList.forEach((cp, index) => {
          if (cp.id === updatedCp.id) {
            this.cartProductList[index] = updatedCp;
          }
        })
      })
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
      return this.clearCart();
    }

    CartProductApi.deleteAll()
      .then(res => this.cartProductList = [])
      .catch(error => console.error(error))
  }

  clearCart = () => {
    this.cartProductList = [];
    localStorage.setItem('cart', JSON.stringify([]));
  }
}

decorate(CartStore, {
  cartProductList: observable,
  sum: computed,
  allProductCount: computed,
  getCart: action,
  addProductToCart: action,
  updateCartProduct: action,
  deleteCartProductById: action,
  deleteAll: action,
  clearCart: action,
})

export default new CartStore();
