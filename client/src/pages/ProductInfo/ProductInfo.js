import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import ProductImageApi from 'api/ProductImageApi';

const Wrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;

  > div{
    width: 40%;
    min-width: 300px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.8rem;
    margin: 0 10px;
    max-width: 500px;
    background: hsl(0,0%,95%);
    border-radius: 10px;
    padding: 20px;
    border: 1px solid hsl(0, 0%, 90%);
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
  }

  .main{
    text-align: center;
  }

  .info {
    width: 20%;
    ${'' /* min-width: 300px; */}
  }
  h1 {
    text-align: center;
  }
  p{
    height: 100%;
    border: 1px solid hsl(0, 0%, 90%);
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
    background: hsl(0,0%,98%);
    border-radius: 5px;
    padding: 5px 5px;
    text-align: left;
  }
  img{
    max-width: 100%;
    border-radius: 3px;
    height: auto;
    max-height: 400px;
  }

`
const Placeholder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
`;

const Button = styled.button`
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
`


class ProductInfo extends Component {
  componentDidMount() {
    this.props.productStore.getOne(this.props.match.params.id);
  }

  handleAdd = () => {
     this.props.cartStore.addCartProductByProductId(this.props.match.params.id)
      .catch(error => console.error(error));
  }

  render(){
    const product = this.props.productStore.product;
    // const product = {
    //   name: 'Iphone',
    //   amount: '6',
    //    images: ['https://www.t-mobile.com/content/dam/t-mobile/en-p/cell-phones/apple/apple-iphone-6s-plus/space-grey/apple-iphone-6splus-spacegray-1-3x.jpg'],
    //   price: '700',
    //   description: "It's an Iphone"
    // };
    return (
      <Wrapper>
        <div className="main">
          <h1>{product.name}</h1>
          {product.productImages && product.productImages.length > 0 ? <img src={ProductImageApi.get(product.productImages [0].id)} alt={product.name}/> : <Placeholder>No image</Placeholder>}
        </div>
        <div className="info">
          <h1>Info</h1>
          <h3>Price: {product.price} Eur</h3>
          <strong>Units left: {product.quantity}</strong>
          <p>
            {product.description}
          </p>
          <Button disabled={product.quantity === 0} onClick={this.handleAdd}>Add to cart</Button>
        </div>
      </Wrapper>
    )
  }
}

export default inject('productStore', 'cartStore')(observer(ProductInfo));
