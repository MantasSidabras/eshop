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

  @media (max-width: 440px) {
    width: 45%;
    margin: 0 5px 10px 5px;
  }
`

const Name = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  margin-bottom: 5px;
  min-height: 40px;
  color: hsla(0, 0%, 0%, 0.85);
`;

const Image = styled.img`
  max-width: 100%;
  border-radius: 3px;
  height: auto;
`;

const Placeholder = styled.div`
position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-top: 100%;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
`;

const Text = styled.div`
  position:absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
  justify-content: center;
  align-items: center;
`

const Price = styled.div`
  margin: 5px 0;
  font-weight: bold;
`;

const Add = styled.button`
  width: 100%;
  padding: 7px 14px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  background: hsl(110, 60%, 75%);
  border: 1px solid hsl(110, 35%, 55%);
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
    this.props.cartStore.addProductToCart(this.props)
      .catch(error => {
        console.error(error.message);
        if (error.status === 401) {
          this.props.userStore.logout();
          return this.props.history.push('/login');
        }
      });
  }

  navigateToProduct = () => {
    this.props.history.push('/product/' + this.props.id);
  }

  render() {
    const { name, price, productImages, quantity } = this.props;
    return (
      <Wrapper onClick={this.navigateToProduct}>
          <Name>{name}</Name>
          {productImages.length > 0 ? <Image src={ProductImageApi.get(productImages[0].id)} /> : <Placeholder><Text>No image</Text></Placeholder>}
        <div style={{ width: '100%'}}>
          <Price>{price.toFixed(2)}€</Price>
          <Add disabled={quantity === 0} onClick={this.handleAdd}>Add to cart</Add>
        </div>
      </Wrapper>
    );
  }
}

export default inject('cartStore', 'userStore')(Product);
