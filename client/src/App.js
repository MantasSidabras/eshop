import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Context from 'MyContext';
import ProductApi from 'api/ProductApi'
import UserApi from 'api/UserApi';
import Header from './components/Header';
import Home from './pages/Home/Home';

import Manage from './pages/Manage/Manage';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Cart from './pages/Cart/Cart';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 1230px) {
    width: calc(100% - 30px);
  }
`;

const Backdrop = styled.div`
  position: absolute;
  width: 100%;
  height: 135px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  z-index: -1;
  background-color: hsl(0, 0%, 99%);
`;

class State extends Component {
  state = {
    products: [],
    users: [],
    user: null,
  }

  fetchAllProducts = () => {
    ProductApi.getAll()
      .then(products => this.setState({ products }))
      .catch(error => console.error(error))
  }

  fetchAllUsers = () => {
    UserApi.getAll()
      .then(users => this.setState({ users }))
      .catch(error => console.error(error))
  }

  fetchUser = () => {
    UserApi.getById(1)
      .then(user => this.setState({ user }))
      .catch(error => console.error(error))
  }

  componentDidMount() {
    this.fetchAllProducts();
    this.fetchAllUsers();
    this.fetchUser();
  }

  render() {
    return (
      <Context.Provider value={{
          ...this.state,
          cartProductCount: this.state.user && this.state.user.cartProductList.length,
          fetchAllProducts: this.fetchAllProducts,
          fetchAllUsers: this.fetchAllUsers,
          fetchUser: this.fetchUser
        }}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

class App extends Component {
  render() {
    return (
      <State>
        <Backdrop />
        <Router>
          <ContentWrapper>
            <Header>e-Shop</Header>
            <Switch>
              <Route exact path='/' component={Home}/>
              <Route path='/manage' component={Manage}/>
              <Route path='/register' component={Register}/>
              <Route path='/login' component={Login}/>
              <Route path='/cart' component={Cart}/>
              <Redirect to='/'/>
            </Switch>
          </ContentWrapper>
        </Router>
      </State>
    );
  }
}

export default App;
