import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { inject } from 'mobx-react';

import Header from './components/Header';
import Home from './pages/Home/Home';
import Manage from './pages/Manage/Manage';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Cart from './pages/Cart/Cart';
import ProtectedRoute from './components/ProtectedRoute';

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

class App extends Component {
  state = {
    loaded: false
  }
  componentDidMount() {
    this.props.productStore.getAll();
    this.props.userStore.fetchUser()
      .then(() => this.setState({ loaded: true })) 
  }

  render() {
    if (this.state.loaded) {
      return (
        <div>
          <Backdrop />
          <Router>
            <ContentWrapper>
              <Header>e-Shop</Header>
              <Switch>
                <Route exact path='/' component={Home}/>
                <ProtectedRoute path='/manage' component={Manage}/>
                <Route path='/register' component={Register}/>
                <Route path='/login' component={Login}/>
                <Route path='/cart' component={Cart}/>
                <Redirect to='/'/>
              </Switch>
            </ContentWrapper>
          </Router>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default inject('productStore', 'userStore')(App);
