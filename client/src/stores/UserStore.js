import { observable, action, decorate, computed } from 'mobx';

import AuthApi from '../api/AuthApi';
import UserApi from '../api/UserApi';
import CartStore from './CartStore';

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
    if (!token) {
      this.user = {};
      return Promise.resolve();
    }
    
    console.log(token.id);
    return Promise.all([
      UserApi.getById(token.id).then(user => this.user = user),
      CartStore.getCart()
    ])
      .catch(error => console.error(error))
  }

  get fullName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
  
  get isLoggedIn() {
    return this.user && AuthApi.isTokenValid();
  }

  get isAdmin() {
    return this.user && this.user.admin;
  }

  // TODO: complete login
  login = user => {
    // { id: 1, exp: 2526034923 }
    // AuthApi.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJleHAiOiIyNTI2MDM0OTIzIn0.at9alWgKvNrNHSncYW8yfEqzm0GVIlWS5AML5-7YW74');
    // this.fetchUser();
    UserApi.login(user)
      .then(res => {
        AuthApi.setToken(res.token);
        this.user = res.user;
        CartStore.getCart();
      })
      .catch(err => console.error(err));
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