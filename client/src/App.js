import React, { Component } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Context from 'MyContext';
import Header from './components/Header';
import Home from './pages/Home/Home';
import Manage from './pages/Manage/Manage'

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
    users: []
  }

  fetchAllProducts = () => {
    fetch('http://localhost:8080/api/product')
      .then(res => res.json())
      .then(products => this.setState({ products }))
      .catch(error => console.error(error))
  }

  fetchAllUsers = () => {
    fetch('http://localhost:8080/api/user')
      .then(res => res.json())
      .then(users => this.setState({ users }))
      .catch(error => console.error(error))
  }

  componentDidMount() {
    this.fetchAllProducts();
    this.fetchAllUsers();

    // fetch('http://localhost:8080/api/user/1')
    //   .then(res => {
    //     if (res.status === 404) {
    //       throw Error("User not found")
    //     } else {
    //       return res.json()
    //     }
    //   })
    //   .then(res => console.log(res))
    //   .catch(error => console.error(error))

  }

  render() {
    return (
      <Context.Provider value={{...this.state, fetchAllProducts: this.fetchAllProducts, fetchAllUsers: this.fetchAllUsers}}>
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
              <Redirect to='/'/>
            </Switch>
          </ContentWrapper>
        </Router>
      </State>
    );
  }
}

export default App;
