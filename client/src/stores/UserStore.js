import { observable, action, decorate, computed } from 'mobx';

import AuthApi from '../api/AuthApi';
import UserApi from '../api/UserApi';
import CartStore from './CartStore';
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
    if (!AuthApi.isTokenValid()) {
      this.user = {};
      return CartStore.getCart();
    }

    const token = AuthApi.getDecodedToken();

    return UserApi.getById(token.id)
      .then(user => {
        this.user = user;
        CartStore.cartProductList = user.cartProductList;
      })
      .catch(error => console.error(error))
  }

  get fullName() {
    return this.user && `${this.user.firstName} ${this.user.lastName}`;
  }

  get isLoggedIn() {
    return this.user && AuthApi.isTokenValid();
  }

  get isAdmin() {
    return this.user && this.user.admin;
  }

  login = user => {
    return UserApi.login(user)
      .then(res => {
        AuthApi.setToken(res.token);
        this.user = res.user;
      })
      .then(() => Promise.all([CartStore.cartProductList.map(cp => CartProductApi.sync(cp))]))
      .then(() => setTimeout(() => CartStore.getCart(), 50))
  }

  logout = () => {
    AuthApi.removeToken();
    this.user = null;
    CartStore.clearCart();
  }
}

decorate(UserStore, {
  allUsers: observable,
  user: observable,
  getAll: action,
  fetchUser: action,
  isLoggedIn: computed,
  isAdmin: computed,
  login: action,
  logout: action,
})

export default new UserStore();
