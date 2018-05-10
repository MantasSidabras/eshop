import React, { Component } from 'react';
import styled from 'styled-components';

import AddProduct from './AddProduct/AddProduct';
import AllProducts from './AllProducts/AllProducts';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ButtonGroup = styled.div`
  display: flex;

  button:first-child {
    border-right: none;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;

    &:focus {
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      box-shadow: 0 0 0 1px #4D90FE;
    }
  }

  button:last-child {
    border-left: none;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;

    &:focus {
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px;
      box-shadow: 0 0 0 1px #4D90FE;
    }
  }

  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 7px 14px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  color: hsl(0, 0%, 100%);
  background: hsl(210, 60%, 60%);
  border: 1px solid hsl(210, 50%, 45%);
  outline: none;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  
  ${props => props.active && 'background: hsl(210, 50%, 45%);'}
  ${props => props.active && 'box-shadow: inset 0 2px 4px hsla(0, 0%, 0%, 0.2);'}

  &:hover {
    background: hsl(210, 50%, 50%);
  }

  &:focus {
    box-shadow: 0 0 0 1px #4D90FE;
  }

  @media (max-width: 630px) {
    width: 33.33%;
  }
`
class Products extends Component {
  state = {
    showAllProducts: true,
    showAddProduct: false,
  }

  handleAllClick = () => this.setState({ showAllProducts: true, showAddProduct: false});

  handleAddClick = () => this.setState({ showAllProducts: false, showAddProduct: true});

  render() {
    const { showAllProducts, showAddProduct } = this.state;
    return (
      <Wrapper>
        <ButtonGroup>
          <Button active={showAllProducts} onClick={this.handleAllClick}>All products</Button>
          <Button active={showAddProduct} onClick={this.handleAddClick}>New product</Button>
          <Button>Import products</Button>
        </ButtonGroup>

        {showAllProducts && <AllProducts />}
        {showAddProduct && <AddProduct />}
      </Wrapper>
    );
  }
}

export default Products;
