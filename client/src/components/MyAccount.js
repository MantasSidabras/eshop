import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { inject } from 'mobx-react';

const Wrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 150px;
  text-align: left;
  background: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  outline: none;
  z-index: 999;

  > div {
    padding: 8px 15px;
  }
`

const StyledLink = styled(Link)`
  display: block;
  padding: 8px 15px;
  color: hsla(0, 0%, 0%, 0.75);
  text-decoration: none;
  transition: 0.2s ease-in-out;

  &:hover {
    color: hsla(0, 0%, 0%, 0.85);
    background: hsl(0, 0%, 96%);
  }
`

const MyHistory = styled.div`
  transition: 0.2s ease-in-out;

  &:hover {
    color: hsla(0, 0%, 0%, 0.85);
    background: hsl(0, 0%, 96%);
  }
`

const Logout = styled.div`
  background: hsl(0, 75%, 60%);
  color: hsla(0, 0%, 100%, 0.95);
  transition: 0.2s ease-in-out;

  &:hover {
    background: hsl(0, 65%, 55%);
  }
`

class MyAccount extends Component {
  ref = React.createRef();

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleClickOutside = e => {
    if (![...this.ref.current.children].includes(e.target)) {
      this.props.hide();
    }
  }

  handleLogout = () => {
    this.props.userStore.logout()
  }

  render() { 
    return ( 
      <Wrapper innerRef={this.ref} >
        <StyledLink to='/editAccount'>Edit Account</StyledLink>
        <MyHistory>My history</MyHistory>
        <Logout onClick={this.handleLogout}>Logout</Logout>
      </Wrapper>
    )
  }
}
 
export default inject('userStore')(MyAccount);