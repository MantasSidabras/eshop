import { observable, action, decorate, computed } from 'mobx';

import AuthApi from '../api/AuthApi';
import UserApi from '../api/UserApi';
import CartProductApi from '../api/CartProductApi';

class UserStore {
  allUsers = [];
  user = null;

  getAll = () => {
    return UserApi.getAll()
      .then(users => this.allUsers = users)
      .catch(error => console.error(error))
  }

  fetchUser = () => {
    const token = AuthApi.getDecodedToken();

    if (!token) return;
    
    return UserApi.getById(token.id)
      .then(user => this.user = user)
      .catch(error => console.error(error))
  }

  get cartProductList() {
    return this.user ? this.user.cartProductList : [];
  }

  get isLoggedIn() {
    return this.user || AuthApi.isTokenValid();
  }

  get isAdmin() {
    const token = AuthApi.getDecodedToken();
    return this.isLoggedIn && token.admin;
  }

  // TODO: complete login
  login = user => {
    // { id: 1, admin: true }
    AuthApi.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJhZG1pbiI6InRydWUifQ.zozomEoqEKXLAlkaozTq4wypsJYOnHJNUB-FUM1zIS0');
    this.fetchUser();
    // UserApi.login(user)
    //   .then(res => {
    //     AuthApi.setToken(res.token);
    //     this.user = res.user;
    //   })
    //   .catch(err => console.error(err));
  }

  logout = () => {
    AuthApi.removeToken();
    this.user = null;
  }

  addCartProductById = productId => {
    if (!this.isLoggedIn) {
      // TODO: somehow add product when not logged in
      return console.error(new Error('Please login again'));
    }

    const token = AuthApi.getDecodedToken();

    const cartProduct = {
      productId,
      userId: token.id 
    }

    return CartProductApi.add(cartProduct)
      .then(res => this.fetchUser())
      .catch(error => console.error(error))
  }

  updateCartProduct = cartProduct => {
    return CartProductApi.update(cartProduct)
      .then(res => this.fetchUser())
  }

  deleteCartProductById = id => {
    return CartProductApi.deleteById(id)
      .then(res => this.fetchUser())
      .catch(error => console.error(error))
  }

  clearCart = () => {
    const token = AuthApi.getDecodedToken();
    return UserApi.deleteAllCartProducts(token.id)
      .then(res => this.fetchUser())
      .catch(error => console.error(error))
  }
}

decorate(UserStore, {
  allUsers: observable,
  user: observable,
  getAll: action,
  fetchUser: action,
  cartProductList: computed,
  isLoggedIn: computed,
  isAdmin: computed,
  login: action,
  logout: action,
  addCartProductById: action,
  updateCartProduct: action,
  deleteCartProductById: action,
  deleteAllCartProducts: action
})

export default new UserStore();