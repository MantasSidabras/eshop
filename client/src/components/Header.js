import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink, Link } from 'react-router-dom';

const Wrapper = styled.header`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px 0;
  padding-top: 25px;
  background-color: hsl(0, 0%, 98%);
`

const Title = styled.h1`
  margin: 0;
`
const Nav = styled.ul`
  display: flex;
  flex-grow: 1;
  align-items: center;
  margin: 0;
  font-size: 1.2rem;
  border-radius: 5px;
  list-style: none;

  li {
    display: inline-block;
    margin-right: 20px;
    a {
      display: inline-block;
      padding: 5px 0;
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
    transition: 0.2s ease-in-out;
    text-align: center;

    ${props => props.active && 'background: hsl(210, 50%, 45%);'}
    ${props => props.active && 'box-shadow: inset 0 2px 4px hsla(0, 0%, 0%, 0.2);'}

    &:hover {
      background: hsl(210, 50%, 50%);
    }

    &:focus {
      box-shadow: 0 0 0 1px #4D90FE;
    }

    &:hover {
      color: hsla(0, 0%, 0%, 0.85);
      border-bottom: 2px solid hsl(210, 70%, 60%);
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
  padding: 7px 20px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: hsl(0, 0%, 100%);
  background: hsl(210, 60%, 60%);
  border: 1px solid hsl(210, 50%, 45%);
  outline: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  text-align: center;

${'' /*
  ${props => props.active && 'background: hsl(210, 50%, 45%);'}
  ${props => props.active && 'box-shadow: inset 0 2px 4px hsla(0, 0%, 0%, 0.2);'} */}


  &:hover {
    background: hsl(210, 50%, 50%);
  }

  ${'' /* &:focus {
    box-shadow: 0 0 0 1px #4D90FE;
  } */}

  &:first-child {
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  &:last-child {
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
`



class Header extends Component {
  render() {
    return (
      <Wrapper>
        <Title>{this.props.children}</Title>
        <Nav>
          <li><NavLink exact to='/'>Home</NavLink></li>
          <li><NavLink to='/manage'>Manage</NavLink></li>
        </Nav>
        <LoginNav>
          <RegisterLink to="/register">Register</RegisterLink>
        <RegisterLink to="/login">Login</RegisterLink>
        </LoginNav>
      </Wrapper>
    );
  }
}

export default Header;
