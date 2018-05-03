import React, { Component } from 'react';
import styled from 'styled-components';

import ProductApi from 'api/ProductApi'
import ImageSelect from 'components/ImageSelect';
import ProductForm from 'components/ProductForm';

const Wrapper = styled.form`
  width: 100%;
  max-width: 450px;
`

const Add = styled.button`
  padding: 7px 14px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  background: hsl(110, 50%, 78%);
  border: 1px solid hsl(110, 30%, 50%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    background: hsl(110, 50%, 72%);
  }

  &:active {
    background: hsl(110, 45%, 67%);
    transform: scale(0.98);
  }
`

class AddProduct extends Component {
  state = {
    name: '',
    description: '',
    price: '',
    quantity: 1,
    images: []
  }

  handleDrop = images => { 
    this.setState({ images });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();

    const product = { 
      id: this.props.id,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      quantity: this.state.quantity
    };

    const formData = new FormData();

    for (const image of this.state.images) {
      formData.append('file', image)
    }

    ProductApi.create(product)
      .then(added => (
        ProductApi.addImages(added.id, formData)
          .then(res => {
            alert(res.message);
            this.props.fetchAllProducts();
          })
      ))
      .catch(error => console.error(error));
  }
   
  handleImageClick = name => this.setState({ images: this.state.images.filter(i => i.name !== name )});
  
  render() { 
    const { images } = this.state;
    return ( 
      <Wrapper onSubmit={this.handleSubmit}>
        <ProductForm onChange={this.handleChange} {...this.state} />

        <label>Images</label>
        <ImageSelect 
          onDrop={this.handleDrop} 
          images={images} 
          onImageClick={this.handleImageClick}
        />

        <Add>Add product</Add>
      </Wrapper>
     )
  }
}
 
export default AddProduct;