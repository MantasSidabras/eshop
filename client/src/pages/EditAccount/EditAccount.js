import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import UserApi from 'api/UserApi';
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
`

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  margin: 0 auto;
  background: hsl(0, 0%, 100%);
  border-radius: 3px;

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
`

const Button = styled.button`
  padding: 7px 14px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
`

const Save = Button.extend`
  margin-right: 10px;
  background: hsl(110, 50%, 78%);
  border: 1px solid hsl(110, 30%, 50%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  transition: 0.2s ease-in-out;

  &:hover {
    background: hsl(110, 50%, 72%);
  }

  &:active {
    background: hsl(110, 45%, 67%);
    transform: scale(0.98);
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
    ${props => props.error ? 'background: hsl(0, 50%, 90%);' : 'background: hsl(110, 50%, 85%);'}
    border-radius: 3px;

    @media (min-width: 700px) {
      margin-top: -20vh;
    }
  }
`

class EditAccount extends Component {
  constructor(props) {
    super(props);
    const user = this.props.userStore.user;
    this.state = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      zipCode: user.zipCode,
      password: '',
      password2: '',
      showMessage: false,
      error: true,
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ showMessage: false });
    
    const { password, password2 } = this.state;

    if ((password.length > 0 || password2.length > 0) && password !== password2) {
      this.setState({ showMessage: true, error: true })
      this.timeout = setTimeout(() => this.setState({ showMessage: false }), 1500)
      return;
    }

    const user = Object.assign({}, this.props.userStore.user, this.state);

    UserApi.update(user)
      .then(res => {
        this.props.userStore.fetchUser();
        this.setState({ showMessage: true, error: false, password: '', password2: '' });
        this.timeout = setTimeout(() => this.setState({ showMessage: false }), 1200)
      })
      .catch(error => console.error(error))
  }

  handleClose = () => {
    clearTimeout(this.timeout);
    this.setState({ showMessage: false });
  }

  render() {
    const { firstName, lastName, email, address, zipCode, showMessage, password, password2, error } = this.state;

    if (this.props.userStore.isLoggedIn) {
      return ( 
        <Wrapper>
          <Form onSubmit={this.handleSubmit}>
            <label htmlFor='firstName'>First Name</label>
            <input type="text" id='firstName' name='firstName' value={firstName} onChange={this.handleChange} required />

            <label htmlFor='lastName'>Last Name</label>
            <input type="text" id='lastName' name='lastName' value={lastName} onChange={this.handleChange} required />

            <label htmlFor='email'>Email</label>
            <input type="text" id='email' name='email' value={email} onChange={this.handleChange} required />

            <label htmlFor='address'>Address</label>
            <input type="text" id='address' name='address' value={address} onChange={this.handleChange} required />

            <label htmlFor='zipCode'>Zip Code</label>
            <input type="text" id='zipCode' name='zipCode' value={zipCode} onChange={this.handleChange} required />

            <label htmlFor='password'>New password</label>
            <input type="password" id='password' name='password' value={password} onChange={this.handleChange} />

            <label htmlFor='password2'>Enter new password again</label>
            <input type="password" id='password2' name='password2' value={password2} onChange={this.handleChange} />

            <Save>Save</Save>
          </Form>
          <FadeIn in={showMessage}>
            <Message error={error} onClick={this.handleClose}>
              <ScaleUp>
                {error 
                  ? <div>Passwords don't match</div>
                  : <div>Edited successfully!</div>
                }
              </ScaleUp>
            </Message>
          </FadeIn>
        </Wrapper>
      )
    } else {
      return <Redirect to='/' />
    }
  }
}
 
export default inject('userStore')(observer(EditAccount));