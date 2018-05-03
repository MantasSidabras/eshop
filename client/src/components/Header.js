import React, { Component } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Wrapper = styled.header`
  display: flex;
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

class Header extends Component {
  render() {
    return (
      <Wrapper>
        <Title>{this.props.children}</Title>
        <Nav>
          <li><NavLink exact to='/'>Home</NavLink></li>
          <li><NavLink to='/manage'>Manage</NavLink></li>
        </Nav>
      </Wrapper>
    );
  }
}

export default Header;
