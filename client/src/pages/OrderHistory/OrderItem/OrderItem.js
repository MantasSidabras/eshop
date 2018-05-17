import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import format from 'date-fns/format';

import SlideDown from 'animations/SlideDown';

const Wrapper = styled.div`
  width: 100%;
  cursor: pointer;

  &:last-child {
    border-bottom: 1px solid hsl(0, 0%, 85%);
  }
`

const Order = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 8px;
  ${'' /* height: 40px; */}
  background: hsl(0, 0%, 99%);
  border-top: 1px solid hsl(0, 0%, 85%);
  border-right: 1px solid hsl(0, 0%, 85%);
  border-left: 3px solid hsl(210, 60%, 60%);
  transition: all 0.2s ease-in-out;

  &:hover {
    background: hsl(0, 0%, 100%);
    ${props => !props.showProducts && 'transform: scale(1.01);'}
  }
`

const DateCreated = styled.div`
  display: flex;
  align-items: center;
`;

const OrderPrice = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 10px;
  color: hsla(0, 0%, 0%, 0.85);
`;

const Label = styled.div`
  width: 66px;
  padding: 4px 6px;
  ${props => props.sent && 'background: hsl(110, 80%, 40%);'}
  ${props => props.pending && 'background: hsl(0, 0%, 70%);'}
  color: hsla(0, 0%, 100%, 0.95);
  font-size: 0.75rem;
  text-align: center;
  ${props => props.sent && 'border: 1px solid hsl(110, 80%, 30%);'}
  ${props => props.pending && 'border: 1px solid hsl(0, 0%, 60%);'}
  border-radius: 3px;
`

const ProductListWrapper = styled.div`
  border: 1px solid hsl(0, 0%, 75%);
`

const ProductWrapper = styled.div`
  display: flex;
  padding: 0px 10px 5px 10px;

`

const Name = styled.div`
  display: flex;
  align-items: center; 
  flex-grow: 1;
  min-width: 80px;
`

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  text-align: center;
`
const Quantity = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  text-align: center;
`

class OrderItem extends Component {
  state = {
    showProducts: false
  }

  toggleShowProducts = e => {
    e.stopPropagation();
    this.setState({ showProducts: !this.state.showProducts });
  }

  render() {
    const { dateCreated, dateCompleted, price, state, orderProductList } = this.props;
    const { showProducts } = this.state;
    return ( 
      <Wrapper onClick={this.toggleShowProducts}>
        <Order showProducts={showProducts}>
          <DateCreated>{format(dateCreated, 'YYYY-MM-DD, HH:mm')}</DateCreated>
          <div>{dateCompleted}</div>
          <OrderPrice>{price.toFixed(2)}€</OrderPrice>       
          {state 
            ? <Label sent>Sent</Label>
            : <Label pending>Pending</Label>
          } 
        </Order>

        <SlideDown in={showProducts}>
          <ProductListWrapper>
            <div style={{ display: 'flex', padding: '5px 10px 5px 10px',  fontWeight: 'bold'}}>
              <div style={{ flexGrow: 1, textAlign: 'center' }}>Item</div>
              <div style={{ width: 110,  textAlign: 'center' }}>Unit Price</div>
              <div style={{ width: 70,  textAlign: 'center' }}>Units</div>
              <div style={{ width: 110,  textAlign: 'center'}}>Total Price</div>
            </div>
            {orderProductList.map(op => 
              <ProductWrapper key={op.id}>
                <Name>{op.product.name}</Name>
                <Price>{op.product.price.toFixed(2)}€</Price>
                <Quantity>{op.quantity}</Quantity>
                <Price>{(op.product.price * op.quantity).toFixed(2)}€</Price>
              </ProductWrapper>
            )}
          </ProductListWrapper>
        </SlideDown>

      </Wrapper> 
    )
  }
}
 
export default inject('userStore')(OrderItem);