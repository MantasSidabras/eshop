import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import FadeIn from 'animations/FadeIn';
import ScaleUp from 'animations/ScaleUp';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;

  > div {
    width: 100%;
    max-width: 500px;
    background: hsl(0,0%,95%);
    border-radius: 10px;
    padding: 30px;
    padding-top: 0px;
    border: 1px solid hsl(0, 0%, 90%);
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
  }

  label {
    display: block;
    color: hsla(0, 0%, 0%, 0.85);
  }
  margin: 0 auto;
  input {
    width: 100%;
    padding: 3px;
    margin-bottom: 15px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9rem;
    color: hsla(0, 0%, 0%, 0.75);
    border: 1px solid hsl(0, 0%, 75%);
    border-radius: 3px;
    box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.08);
  }

  button{
    border-radius: 5px;
    width: 100%;
    margin-top: 10px;
    padding: 7px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9rem;
    color: hsl(0, 0%, 100%);
    background: hsl(135, 60%, 45%);
    border: 1px solid hsl(135, 65%, 40%);
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
    outline: none;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    text-align: center;

    &:hover {
      background: hsl(135, 60%, 40%);
    }
  }
  `
const Message = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: hsla(0, 0%, 0%, 0.6);
  z-index: 999;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 3rem;
    background: hsl(0, 50%, 85%);
    border-radius: 3px;

    @media (min-width: 700px) {
      margin-top: -20vh;
    }
  }
  `



class Login extends Component {
  state = {
    email: '',
    password: '',
    displayPopup: null,
    errorMsg: ''
  };

  onChange = (e) => {
    const{name, value} = e.target;
    this.setState({ [name]: value });
  }

  login = (e) => {
    e.preventDefault();
    this.props.userStore.login(this.state)
    .catch(err => {
      this.setState({ displayPopup: true, errorMsg: err.message });
      this.timeout = setTimeout(() => {
        this.setState({displayPopup: false, errorMsg: ''});
      }, 2000);
    });
    // TODO: login user
  }

  handleClose = () => {
    clearTimeout(this.timeout);
    this.setState({ displayPopup: false });
  }

  render() {
    if (this.props.userStore.isLoggedIn) {
      return <Redirect to='/' />
    } else {
      return (
        <Wrapper>
          <div>
            <h2>Login</h2>
            <form onSubmit={this.login}>
              <label htmlFor='email'>Email</label>
              <input type="text" id='email' name='email' onChange={this.onChange} required />
              <label htmlFor='password2'>Password</label>
              <input type="password" id='password' name='password' onChange={this.onChange} required />
              <button type="submit">Login</button>
            </form>
            <FadeIn in={this.state.displayPopup}>
              <Message onClick={this.handleClose}>
                <ScaleUp>
                  {this.state.errorMsg ? <div>{this.state.errorMsg}</div> : <div></div> }
                </ScaleUp>
              </Message>
            </FadeIn>
          </div>
        </Wrapper>
      )
    }
  }
}

export default inject('userStore')(observer(Login));
