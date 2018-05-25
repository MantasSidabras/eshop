import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import ProductImageApi from 'api/ProductImageApi';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 160px;
  padding: 5px;
  margin: 0 10px 20px 10px;
  text-align: center;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 5px 10px -1px hsla(0, 0%, 0%, 0.12), 0 2px 4px -1px hsla(0, 0%, 0%, 0.15);
  }
`

const Name = styled.div`
  overflow: hidden;
  width: 100%;
  margin-bottom: 5px;
  color: hsla(0, 0%, 0%, 0.85);
`;

const Image = styled.img`
  max-width: 100%;
  border-radius: 3px;
  height: auto;
`;

const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 100%;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
`;

const Price = styled.div`
  margin: 5px 0;
  font-weight: bold;
`;

const Add = styled.button`
  width: 100%;
  padding: 7px 14px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  background: hsl(110, 50%, 78%);
  border: 1px solid hsl(110, 30%, 50%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;

  ${props => props.disabled ? `cursor: not-allowed;` : `
    &:hover {
      background: hsl(110, 50%, 72%);
    }

    &:active {
      background: hsl(110, 45%, 67%);
      transform: scale(0.98);
    }
  `}
`;

class Product extends Component {
  handleAdd = (e) => {
    e.stopPropagation();
    this.props.cartStore.addCartProductByProductId(this.props);
  }

  navigateToProduct = () => {
    this.props.history.push('/product/' + this.props.id);
  }

  render() {
    const { name, price, productImages, quantity } = this.props;
    return (
      <Wrapper onClick={this.navigateToProduct}>
          <Name>{name}</Name>
          {productImages.length > 0 ? <Image src={ProductImageApi.get(productImages[0].id)} /> : <Placeholder>No image</Placeholder>}
        <div style={{ width: '100%'}}>
          <Price>{price.toFixed(2)}€</Price>
          <Add disabled={quantity === 0} onClick={this.handleAdd}>Add to cart</Add>
        </div>
      </Wrapper>
    );
  }
}

export default inject('cartStore')(Product);
