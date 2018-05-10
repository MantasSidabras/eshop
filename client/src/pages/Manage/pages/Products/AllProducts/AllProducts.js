import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import ProductItem from './ProductItem/ProductItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Search = styled.input.attrs({
  type: "text", 
  placeholder: "Search..."
})`
  width: 100%;
  max-width: 400px;
  padding: 5px;
  padding-left: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-family: 'Roboto', sans-serif;
  color: hsla(0, 0%, 0%, 0.75);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 15px;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-radius: 15px;
    box-shadow: 0 0 0 1px #4D90FE;
  }
`

class AllProducts extends Component {
  state = {
    searchQuery: ''
  }

  handleSearch = e => this.setState({ searchQuery: e.target.value});

  filterProducts = product => product.name.toLowerCase().includes(this.state.searchQuery.toLowerCase());

  render() {
    const { products } = this.props.productStore;
    return ( 
      <Wrapper>
        <Search onChange={this.handleSearch} />
        {products.filter(this.filterProducts).map(product => <ProductItem key={product.id} {...product} />)}
      </Wrapper>
    )
  }
}
 
export default inject('productStore')(observer(AllProducts));