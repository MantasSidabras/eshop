import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 3px;
`
const Name = styled.div`
  display: flex;
  align-items: center; 
  flex-grow: 1;
  min-width: 80px;
  max-width: 360px;
`

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 110px;
  text-align: center;
`
const QuantityWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  text-align: center;
`

const Quantity = styled.input.attrs({
  type: 'number',
  min: '1'
})`
  width: 60px;
  padding: 5px 8px;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
`

const RemoveIcon = styled.i`
  display: flex;
  align-items: center;
  cursor: pointer;
`

const ErrorMsg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 145px;
  padding: 3px;
  background: hsl(0, 70%, 90%);
  text-align: center;
  border: 1px solid hsl(0, 40%, 70%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  transform: translateX(100%);
  z-index: 999;
`

class CartItem extends Component {
  handleQuantityChange = e => {
    if (e.target.value < 1 || e.target.value === '') {
      return;
    }
    
    const cartProduct = { id: this.props.id, quantity: e.target.value };

    this.props.cartStore.updateCartProduct(cartProduct)
      .catch(error => {
        console.error(error.message);
        if (error.status === 401) {
          this.props.userStore.logout();
          return this.props.history.push('/login');
        }
      });
  }

  handleDelete = () => this.props.cartStore.deleteCartProductById(this.props.id);
    
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { product: { name, price }, quantity } = this.props;
    const { error, unitsLeft } = this.props;
    return (
      <Wrapper>
        <Name>{name}</Name>
        <Price>{price.toFixed(2)}€</Price>
        <QuantityWrapper>
          <Quantity onChange={this.handleQuantityChange} value={quantity} />
          {error && <ErrorMsg>Only {unitsLeft} units left</ErrorMsg>}
        </QuantityWrapper>
        <Price>{(price * quantity).toFixed(2)}€</Price>
        <RemoveIcon onClick={this.handleDelete} className="fas fa-times fa-lg" title='Remove item' />
      </Wrapper>
    )
  }
}

export default inject('cartStore', 'userStore')(CartItem);