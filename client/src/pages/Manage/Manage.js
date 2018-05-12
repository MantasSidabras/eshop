import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink, Route, Switch, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Products from './pages/Products/Products';
import Orders from './pages/Orders/Orders';
import Users from './pages/Users/Users';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`

const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 200px;
  min-width: 140px;
  background: hsla(0, 0%, 99%);
  list-style: none;

  li {
    border-bottom: 1px solid hsl(0, 0%, 85%);

    @media (max-width: 480px) {
      width: 33.33%;
      border-bottom: none;

      &:nth-child(2) {
        border-left: 1px solid hsl(0, 0%, 85%);
        border-right: 1px solid hsl(0, 0%, 85%);
      }
    }
  }
  
  a {
    display: block;
    padding: 12px 0px 12px 10px;
    color: hsla(0, 0%, 0%, 0.75);
    background: hsl(0, 0%, 99%);
    border-left: 3px solid transparent;
    border-right: 1px solid hsl(0, 0%, 85%);
    text-decoration: none;
    transition: all 0.2s ease-in-out;

    i {
      text-align: center;
      width: 25px;
    }
    
    &:hover {
      color: hsla(0, 0%, 0%, 0.85);
      background: hsl(0, 0%, 96%);
    }
    
    @media (max-width: 480px) {
      padding-left: 0;
      padding-right: 10px;
      text-align: center;
      border-right: none;
      border-left: none;
      border-top: 3px solid transparent;
      border-bottom: 1px solid hsl(0, 0%, 85%);
    }
  }

  @media (max-width: 480px) {
    flex-direction: row;
    width: 100%;
  }
`

const Content = styled.div`
  flex-grow: 1;
  padding: 1rem;
`

const Extra = styled.div`
  flex-grow: 1;
  border-right: 1px solid hsl(0, 0%, 85%);

  @media (max-width: 480px) {
    display: none
  }
`
class Manage extends Component {
  render() {
    if (this.props.userStore.isLoggedIn && this.props.userStore.isAdmin) {
      return ( 
        <Wrapper>
          <Menu>
            <li>
              <NavLink activeClassName='active-manage' exact to={`${this.props.match.path}`}>
                <i className="fas fa-tag fa-sm"></i> Products
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName='active-manage' to={`${this.props.match.path}/orders`}>
                <i className="fas fa-clipboard-list fa-sm"></i> Orders
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName='active-manage' to={`${this.props.match.path}/users`}>
                <i className="fas fa-users fa-sm"></i> Users
              </NavLink>
            </li>
            <Extra />
          </Menu>
          
          <Content>
            <Switch>
              <Route exact path={this.props.match.url} component={Products}/>
              <Route path={`${this.props.match.url}/orders`} component={Orders}/>
              <Route path={`${this.props.match.url}/users`} component={Users}/>
            </Switch>
          </Content>
        </Wrapper>
      );
    } else {
      return <Redirect to='/' />
    }
  }
}

export default inject('userStore')(observer(Manage));
