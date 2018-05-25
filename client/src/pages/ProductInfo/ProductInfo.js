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
    border-radius: 10px;
    padding: 20px;

  }

  .main{
    text-align: center;
  }

  .info {
    width: 20%;
    border: 1px solid hsl(0, 0%, 90%);
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
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

  table {
    width: 100%;
    margin: 10px 0;
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
    background: hsl(0,0%,98%);
    padding: 5px 5px;
    border-radius: 5px;
  }
  td{
    font-size: 1em;
    padding-bottom: 5px;
  }
  td.name_field {
  }
  td.value_field {
    width: 20px;
    text-align: right;
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
    ${props => props.error ? 'background: hsl(0, 50%, 85%);' : 'background: hsl(110, 50%, 85%);'};
    border-radius: 3px;

    @media (min-width: 700px) {
      margin-top: -20vh;
    }
  }
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
    return (
      <Wrapper>
        <div className="main">
          <h1>{product.name}</h1>
          {product.productImages && product.productImages.length > 0 ? <img src={ProductImageApi.get(product.productImages [0].id)} alt={product.name}/> : <Placeholder>No image</Placeholder>}
        </div>
        <div className="info">
          <h1>Info</h1>
          <h3>Price: {product.price} Eur</h3>
          {product.quantity > 0 ? <strong>In stock: {product.quantity}</strong> : <strong>Out of stock</strong>}
          <p>
            {product.description}
          </p>
          <table>
          {product.productProperties && product.productProperties.map(property => {
            return(
            <tr>
              <td className="name_field">
                {property.name}:
              </td>
              <td className="value_field">
                <strong>{property.value}</strong>
              </td>
            </tr>
          )
          })}
          </table>

          <Button disabled={product.quantity === 0} onClick={this.handleAdd}>Add to cart</Button>

        </div>
      </Wrapper>
    )
  }
}

export default inject('productStore', 'cartStore')(observer(ProductInfo));
