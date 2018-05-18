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
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;

  > div{
    width: 100%;
    max-width: 500px;
    background: hsl(0,0%,95%);
    border-radius: 10px;
    padding: 30px;
    padding-top: 0px;
    border: 1px solid hsl(0, 0%, 90%);
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
  }

  form {

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

  span{
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
    background: hsl(110, 50%, 85%);
    border-radius: 3px;

    @media (min-width: 700px) {
      margin-top: -20vh;
    }
  }
`

class Register extends Component {
  state = {
    firstname: '',
    lastname: '',
    email: '',
    adress: '',
    zipCode: '',
    password: '',
    password2: '',
    err: null,
    displayPopup: null,
    errMsg: ''
  };

  onChange = (e) => {
    const{name, value} = e.target;
    this.setState({ [name]: value });
  }

  register = (e) => {
    e.preventDefault();
    if(this.state.password !== this.state.password2) {
      this.setState({ err: true, errMsg: 'Passwords does not match'});
      return;
    }
    this.setState({ displayPopup: true });
    setTimeout(() => this.setState({ displayPopup: false }), 2000);
    UserApi.create(this.state).then(() => this.props.history.push('/login'));
    console.log(this.state);
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
              <label htmlFor='firstname'>First name</label>
              <input type="text" id='firstname' name='firstname' onChange={this.onChange} required />
              <label htmlFor='lastname'>Last name</label>
              <input type="text" id='lastname' name='lastname' onChange={this.onChange} required />
              <label htmlFor='email'>Email</label>
              <input type="text" id='email' name='email' onChange={this.onChange} required />
              <label htmlFor='adress'>Adress</label>
              <input type="text" id='adress' name='adress' onChange={this.onChange} required />
              <label htmlFor='password'>Password</label>
              <input type="password" id='password' name='password' minLength='8' onChange={this.onChange} required />
              {this.state.err && <div style={{ marginTop: -13, marginBottom: 5, fontSize: '0.8rem', color: 'hsla(0, 90%, 40%, 0.85)'}}>Passwords does not match</div>}
              <label htmlFor='password2'>Repeat password</label>
              <input type="password" id='password2' name='password2' onChange={this.onChange} required />
              <button type="submit">Register</button>
            </form>
            <FadeIn in={this.state.displayPopup}>
              <Message>
                <ScaleUp>
                  <div>Registration successful!</div>
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
