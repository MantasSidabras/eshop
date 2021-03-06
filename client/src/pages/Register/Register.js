import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import FadeIn from 'animations/FadeIn';
import ScaleUp from 'animations/ScaleUp';
import UserApi from 'api/UserApi';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;

  > div{
    width: 100%;
    max-width: 300px;
    border-radius: 3px;
    padding-top: 0px;
  }

  label {
    display: block;
    color: hsla(0, 0%, 0%, 0.85);
  }
  
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

  button {
    border-radius: 3px;
    width: 100%;
    margin-top: 10px;
    padding: 7px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9rem;
    background: hsl(110, 60%, 75%);
    border: 1px solid hsl(110, 35%, 55%);
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
    outline: none;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    text-align: center;

    &:hover {
      background: hsl(110, 50%, 72%);
    }
  }

  span {
    font-family: 'Roboto', sans-serif;
    background: hsl(60, 100%, 70%);
    padding: 15px;
    margin: 25px 0;
    border-radius: 5px;
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
    ${props => props.error ? 'background: hsl(0, 50%, 95%);' : 'background: hsl(110, 50%, 85%);'};
    border-radius: 3px;

    @media (min-width: 700px) {
      margin-top: -20vh;
    }
  }
`

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    zipCode: '',
    password: '',
    password2: '',
    err: null,
    loginErr: null,
    displayPopup: null,
    popupMsg: '',
    errMsg: ''
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onChange = (e) => {
    const{name, value} = e.target;
    this.setState({ [name]: value });
  }

  register = (e) => {
    e.preventDefault();

    if(this.state.password !== this.state.password2) {
      this.setState({ err: true, errMsg: 'Passwords do not match'});
      return;
    }
    UserApi.create(this.state)
      .then(() => {
        this.setState({ displayPopup: true,  loginErr: false, popupMsg: 'Registration successful!' })
        this.timeout = setTimeout(() => {
          this.props.history.push('/login');
        }, 2000);
      })
      .catch(err => {
        this.setState({ displayPopup: true, loginErr: true, popupMsg: err.message });
        this.timeout = setTimeout(() => {
          this.setState({ displayPopup: false });
        }, 2000);
      })
  }

  handleClose = () => {
    clearTimeout(this.timeout);
    this.setState({ displayPopup: false });
    if (!this.state.loginErr) {
      this.props.history.push('/login');
    }
  }

  render() {
    if (this.props.userStore.isLoggedIn) {
      return <Redirect to='/' />
    } else {
      return (
        <Wrapper>
          <div>
            <h2>Register</h2>
            <form onSubmit={this.register}>
              <label htmlFor='firstName'>First name</label>
              <input type="text" id='firstName' name='firstName' onChange={this.onChange} required />
              <label htmlFor='lastName'>Last name</label>
              <input type="text" id='lastName' name='lastName' onChange={this.onChange} required />
              <label htmlFor='email'>Email</label>
              <input type="text" id='email' name='email' onChange={this.onChange} required />
              <label htmlFor='adress'>Address</label>
              <input type="text" id='address' name='address' onChange={this.onChange} required />
              <label htmlFor='adress'>Zip code</label>
              <input style={{width: '40%'}} type="text" id='zipCode' name='zipCode' onChange={this.onChange} required />
              <label htmlFor='password'>Password</label>
              <input type="password" id='password' name='password' minLength='8' onChange={this.onChange} required />
              {this.state.err && <div style={{ marginTop: -13, marginBottom: 5, fontSize: '0.8rem', color: 'hsla(0, 90%, 40%, 0.85)'}}>Passwords does not match</div>}
              <label htmlFor='password2'>Repeat password</label>
              <input type="password" id='password2' name='password2' onChange={this.onChange} required />
              <button type="submit">Register</button>
            </form>
            <FadeIn in={this.state.displayPopup}>
              <Message error={this.state.loginErr} onClick={this.handleClose}>
                <ScaleUp>
                  <div>{this.state.popupMsg}</div>
                </ScaleUp>
              </Message>
            </FadeIn>
          </div>
        </Wrapper>
      )
    }
  }
}


export default inject('userStore')(Register);
