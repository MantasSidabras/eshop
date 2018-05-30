import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import format from 'date-fns/format';

import OrderApi from 'api/OrderApi';
import FadeIn from 'animations/FadeIn';
import SlideDown from 'animations/SlideDown';

const Wrapper = styled.div`
  width: 100%;
  cursor: pointer;

  &:last-child {
    ${props => !props.showProducts && 'border-bottom: 1px solid hsl(0, 0%, 85%);'}
  }
`

const Order = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0 8px;
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

const Id = styled.div`
  display: flex;
  align-items: center;
  width: 25px;
  margin-right: 10px;
  font-weight:bold;
  order: -5;

  @media (max-width: 670px) {
    margin: 0;
  }

`;

const DateCreated = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin: 7px 0;
  margin-right: 10px;

  @media (max-width: 670px) {
    order: -3;
    width: 50%;
  }

  @media (max-width: 500px) {
    width: calc(100% - 25px);
    margin-right: 0px;
  }
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  
  @media (max-width: 670px) {
    width: 100%;
  }

  @media (max-width: 500px) {
    order: -2;
    margin-right: 0;
    margin-bottom: 10px;
    justify-content: center;
  }
`;

const RatingWrap = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 670px) {
    order: -1;
    margin: 0 auto;
  }
`;


const Rating = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  @media (max-width: 670px) {
    margin: 0;
  }
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
  margin: 7px 0;
  align-self: center;
  ${props => props.sent && 'background: hsl(110, 60%, 75%);'}
  ${props => props.pending && 'background: hsl(0, 0%, 85%);'}
  font-size: 0.75rem;
  text-align: center;
  ${props => props.sent && 'border: 1px solid hsl(110, 35%, 55%);'}
  ${props => props.pending && 'border: 1px solid hsl(0, 0%, 65%);'}
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

const CheckoutWrap = styled.div`
  display: flex;
  margin-left: auto;

  @media (max-width: 870px) {
    width: 100%;
  }
`
class OrderItem extends Component {
  state = {
    showIcon: false,
    showProducts: false
  }

  toggleShowProducts = e => {
    e.stopPropagation();
    this.setState({ showProducts: !this.state.showProducts });
  }

  showIcon = () => {
    if(!this.state.showIcons) {
      this.setState({ showIcon: true });
    }
  }
  
  hideIcon = () => this.setState({ showIcon: false });

  handleSent = e => {
    e.stopPropagation();

    const { ...order} = this.props;
    
    order.state = 2;

    OrderApi.update(order)
      .then(res => this.props.orderStore.getAll())
      .catch(error => console.error(error));
  }

  render() {
    const { id, dateCreated, fullName, price, state, orderProductList, rating } = this.props;
    const { showIcon, showProducts } = this.state;
    return ( 
      <Wrapper showProducts={showProducts} onClick={this.toggleShowProducts}>
        <Order 
          onMouseOver={this.showIcon} 
          onMouseLeave={this.hideIcon}
          showProducts={showProducts}
        >
          <Id>{id}</Id>
          <DateCreated>{format(dateCreated, 'YYYY-MM-DD, HH:mm')}</DateCreated>
          <UserName>{fullName}</UserName>
          <RatingWrap>
            {rating && <Rating>{new Array(rating).fill(0).map((el, index) => <i key={index} style={{ color: '#ffb400'}} className="fas fa-star"/>)}</Rating>}
          </RatingWrap>

          <CheckoutWrap>
            <OrderPrice>{price.toFixed(2)}€</OrderPrice>     
            {state === 'Sent'
              ? <Label sent>Sent</Label>
              : <Label pending>Pending</Label>
            } 
            <div style={{ width: 30, height: 'auto', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' }}>
              {state !== 'Sent' &&
                <FadeIn in={showIcon} enterDuration={200} exitDuration={200}>
                  <i title="Mark as sent" className="fas fa-check-square fa-lg" onClick={this.handleSent} /> 
                </FadeIn>
              }
            </div>
          </CheckoutWrap>
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
 
export default inject('orderStore')(OrderItem);