import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import Product from '../../components/Product';

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

const Search = styled.input.attrs({
  type: "text",
  placeholder: "Search..."
})`
  width: 100%;
  max-width: 600px;
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
const Products = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 415px) {
    justify-content: flex-start;
  }
`

class Home extends Component {
  state = {
    searchQuery: ''
  }

  handleSearch = e => this.setState({ searchQuery: e.target.value});

  filterProducts = product => product.name.toLowerCase().includes(this.state.searchQuery.toLowerCase());

  render() {
    return (
      <Wrapper>
        <Search onChange={this.handleSearch} />
        <Products>
          {this.props.productStore.products.filter(this.filterProducts).map(product => <Product history={this.props.history} key={product.id} {...product} />)}
        </Products>
      </Wrapper>
    );
  }
}

export default inject('productStore')(observer(Home));
