import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink, Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import MyAccount from './MyAccount';
import FadeIn from '../animations/FadeIn';

const Wrapper = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  width: 100%;
  padding: 5px 0;
  padding-top: 25px;
  background-color: hsl(0, 0%, 99%);
`

const Title = styled.h1`
  margin: 0;
  margin-right: 30px;
  font-size: 2.1rem;
  a {
    color: hsla(0, 0%, 0%, 0.75);
    text-decoration: none;
  }

  @media (max-width: 550px) {
    width: 100%;
    margin-right: 0;
    text-align: center;
    margin-bottom: 10px;
  }
`

const NavWrap = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;

  @media (max-width: 456px) {
    width: 100%;
    margin-bottom: 10px;
  }
`
const Nav = styled.ul`
  display: inline-block;
  flex-grow: 1;
  margin: 0;
  padding-left: 0;
  font-size: 1.2rem;
  border-radius: 5px;
  list-style: none;

  @media (max-width: 550px) {
    padding-left: 0;
  }

  li {
    display: inline-block;
    margin-right: 20px;
    a {
      display: inline-block;
      padding-bottom: 2px;
      color: hsla(0, 0%, 0%, 0.75);
      border-bottom: 2px solid transparent;
      text-decoration: none;
      transition: all 0.2s ease-in-out;

      &:hover {
        color: hsla(0, 0%, 0%, 0.85);
        border-bottom: 2px solid hsl(210, 70%, 60%);
      }
    }
  }
`
const LoginNav = styled.ul`
  display: flex;
  align-items: flex-end;
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
  border-radius: 5px;
  list-style: none;

   li{
    padding: 10px 20px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9rem;
    color: hsl(0, 0%, 100%);
    background: hsl(210, 60%, 60%);
    border: 1px solid hsl(210, 50%, 45%);
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-align: center;

    ${props => props.active && 'background: hsl(210, 50%, 45%);'}
    ${props => props.active && 'box-shadow: inset 0 2px 4px hsla(0, 0%, 0%, 0.2);'}

    &:hover {
      background: hsl(210, 50%, 50%);
      color: hsla(0, 0%, 0%, 0.85);
      border-bottom: 2px solid hsl(210, 70%, 60%);
    }

    &:focus {
      box-shadow: 0 0 0 1px #4D90FE;
    }

    &:first-child {
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
    }

    &:last-child {
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }
`
const RegisterLink = styled(Link)`
  text-decoration: none;
  padding: 6px 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: hsl(0, 0%, 100%);
  background: hsl(210, 60%, 60%);
  border: 1px solid hsl(210, 50%, 45%);
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: center;

  &:hover {
    background: hsl(210, 50%, 50%);
  }

  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`

const MyAccountLink = styled.button`
  padding: 0;
  padding-bottom: 2px;
  height: 32px;
  color: hsla(0, 0%, 0%, 0.75);
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: hsla(0, 0%, 0%, 0.85);
    border-bottom: 2px solid hsl(210, 70%, 60%);
  }
`

const CartLink = styled(NavLink)`
  padding: 5px 0;
  padding-bottom: 2px;
  height: 32px;
  margin-left: 20px;
  display: inline-block;
  color: hsla(0, 0%, 0%, 0.75);
  font-size: 1.1rem;
  font-family: 'Roboto', sans-serif;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  letter-spacing: 1px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: hsla(0, 0%, 0%, 0.85);
    border-bottom: 2px solid hsl(210, 70%, 60%);

    i {
      color: hsl(210, 60%, 50%)
    }
  }
`

const CartCount = styled.div`
  position:absolute;
  left: 5px;
  bottom: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  font-size: 0.7rem;
  ${props => props.count > 99 && 'font-size: 0.6rem;'}
  border-radius: 50%;
  background: hsl(210, 60%, 60%);
  color: hsl(0, 0%, 100%);
  font-family: 'Roboto', sans-serif;
  padding: 5px;
`

const SomeWrap = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 456px) {
    flex-grow: 1;
    margin: 0;
  }

`;
class Header extends Component {
  state = {
    showMyAccount: false
  }

  handleHideMyAccount = () => this.setState({ showMyAccount: false });

  render() {
    const { isLoggedIn, isAdmin } = this.props.userStore;
    const { sum, allProductCount } = this.props.cartStore;
    const { showMyAccount } = this.state;

    return (
      <Wrapper>
        <Title><a href='/'>{this.props.children}</a></Title>
        <div style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap'}}>
          <NavWrap>
            <Nav>
              <li><NavLink exact to='/'>Home</NavLink></li>
              {isLoggedIn && isAdmin && <li><NavLink to='/manage'>Manage</NavLink></li>}
            </Nav>
          </NavWrap>


          <SomeWrap> 
            {!isLoggedIn &&
              <LoginNav>
                <RegisterLink to="/register">Register</RegisterLink>
                <RegisterLink to="/login">Login</RegisterLink>
              </LoginNav>
            }

            {isLoggedIn && (
              <div style={{ position: 'relative' }}>
                <MyAccountLink onClick={() => this.setState({ showMyAccount: !showMyAccount })}>
                  My Account
                </MyAccountLink>
                <FadeIn in={showMyAccount} enterDuration={200} exitDuration={100}>
                  <MyAccount hide={this.handleHideMyAccount}/>
                </FadeIn>
              </div>
            )}

            <CartLink to='/cart'>
              <i style={{ position: 'relative', marginRight: 2}} className="fas fa-shopping-cart fa-lg">
                <CartCount count={allProductCount}>{allProductCount}</CartCount>
              </i>
              <span style={{ marginRight: 5 }}>CART</span>
              {allProductCount > 0 && <span style={{ fontWeight: 'bold'}} >{sum}€</span>}
            </CartLink>
          </SomeWrap>
        </div>
      </Wrapper>
    );
  }
}

export default withRouter(inject('userStore', 'cartStore')(observer(Header)));
