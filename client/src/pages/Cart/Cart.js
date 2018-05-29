import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import CartItem from './CartItem/CartItem';
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
`

const Title = styled.div`
  font-size: 1.2rem;
`

const Container = styled.div`
  width: 100%;
  max-width: 700px;
`

const CartItemsWrapper = styled.div`
  padding: 1rem;
  margin-bottom: 10px;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
`

const ButtonWrapper = styled.div`
  display: flex;
`

const Button = styled.button`
  padding: 7px 14px;
  width: 100px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;
`

const ClearButton = Button.extend`
  background: hsl(0, 70%, 65%);
  border: 1px solid hsl(0, 30%, 50%);

  &:hover {
    background: hsl(0, 65%, 60%);
  }

  &:active {
    background: hsl(0, 55%, 55%);
    transform: scale(0.98);
  }
`

const ProceedButton = styled.a`
  padding: 7px 14px;
  width: 100px;
  margin-left: auto;
  background: hsl(110, 50%, 78%);
  color: hsla(0, 0%, 0%, 0.750);
  font-size: 0.9rem;
  text-decoration: none;
  border: 1px solid hsl(110, 30%, 50%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    background: hsl(110, 50%, 72%);
  }

  &:active {
    background: hsl(110, 45%, 67%);
    transform: scale(0.98);
  }
`

const TotalPrice = styled.span`
  margin-left: 5px;
  font-Size: 1.2rem;
  font-weight: bold;
`

class Cart extends Component {
  state = {
    error: false,
    errorData: null
  }

  componentDidMount() {
    this.props.cartStore.getCart();
  }

  handleDeleteAll = () => {
    this.props.cartStore.deleteAll();
  }

  handleProceed = e => {
    e.preventDefault();
    const { userStore, history } = this.props;

    if (!userStore.isLoggedIn) {
      return history.push('/register')
    }

    UserApi.checkCartIntegrity(userStore.user.id)
      .then(res => history.push('/purchase'))
      .catch(error => {
        if (error.status === 401) {
          console.error(error.message);
          userStore.logout();
          return history.push('/login');
        }

        this.setState({ error: true, errorData: error });
        this.timeout = setTimeout(() => this.setState({ error: false }), 3000);
      })
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { cartProductList, sum } = this.props.cartStore;
    const { error, errorData } = this.state;
    return ( 
      <Wrapper>
        <Title>Your cart</Title>
        <Container>
          <div style={{ textAlign: 'right', marginBottom: 5 }}>Step 1/2</div>

          <CartItemsWrapper>
            <div style={{ display: 'flex', marginBottom: 8, fontWeight: 'bold' }}>
              <div style={{ flexGrow: 1, textAlign: 'center' }}>Item</div>
              <div style={{ width: 110,  textAlign: 'center' }}>Unit Price</div>
              <div style={{ width: 70,  textAlign: 'center' }}>Units</div>
              <div style={{ width: 110,  textAlign: 'center', marginRight: 20 }}>Total Price</div>
            </div>
   
            {cartProductList.map(cp => <CartItem history={this.props.history} error={error && errorData && errorData[cp.id]} unitsLeft={errorData && errorData[cp.id]} key={cp.id} {...cp} />)}

            {cartProductList.length === 0 
              ? <p style={{textAlign: 'center', color: 'hsla(0, 0%, 0%, 0.6)'}}>Cart is empty</p> 
              : <div style={{ marginTop: 20, textAlign: 'right'}}>
                  <span>
                    Sum:
                    <TotalPrice>{sum}€</TotalPrice>
                  </span>
                </div>
            }
          </CartItemsWrapper>

          {cartProductList.length > 0 &&
            <ButtonWrapper>
              <ClearButton onClick={this.handleDeleteAll} >Clear Cart</ClearButton>
              <ProceedButton onClick={this.handleProceed} >Proceed <i className="fas fa-arrow-right"></i></ProceedButton>
            </ButtonWrapper>
          }
        </Container>
      </Wrapper>
    )
  }
}
 
export default inject('userStore', 'cartStore')(observer(Cart));