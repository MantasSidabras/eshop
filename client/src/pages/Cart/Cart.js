import React, { Component } from 'react';
import styled from 'styled-components';

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
  margin-bottom: 1rem;
`

const CartItemsWrapper = styled.div`
  width: 100%;
  max-width: 700px;
`

const CartItems = styled.div`
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

const BackButton = Button.extend`
  background: hsl(0, 0%, 90%);
  margin-right: 10px;
  border: 1px solid hsl(0, 0%, 50%);

  &:hover {
    background: hsl(0, 0%, 87%);
  }

  &:active {
    background: hsl(0, 0%, 85%);
    transform: scale(0.98);
  }
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

const ProceedButton = Button.extend`
  margin-left: auto;
  background: hsl(110, 50%, 78%);
  border: 1px solid hsl(110, 30%, 50%);

  &:hover {
    background: hsl(110, 50%, 72%);
  }

  &:active {
    background: hsl(110, 45%, 67%);
    transform: scale(0.98);
  }
`

class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }
  render() { 
    return ( 
      <Wrapper>
        <Title>Your cart</Title>
        <CartItemsWrapper>
          <div style={{ textAlign: 'right', marginBottom: 5 }}>Step 1/2</div>
          <CartItems>
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1,  textAlign: 'center' }}>Item</div>
              <div style={{ width: 100,  textAlign: 'center' }}>Unit Price</div>
              <div style={{ width: 50,  textAlign: 'center' }}>Units</div>
              <div style={{ width: 100,  textAlign: 'center' }}>Total Price</div>
            </div>

            
          
          </CartItems>
          <ButtonWrapper>
            <BackButton><i className="fas fa-arrow-left"></i> Back</BackButton>
            <ClearButton>Clear Cart</ClearButton>
            <ProceedButton>Proceed <i className="fas fa-arrow-right"></i></ProceedButton>
          </ButtonWrapper>
        </CartItemsWrapper>
      </Wrapper>
     )
  }
}
 
export default Cart;