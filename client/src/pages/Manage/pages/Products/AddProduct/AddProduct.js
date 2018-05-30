import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import ProductApi from 'api/ProductApi'
import ImageSelect from 'components/ImageSelect';
import ProductForm from 'components/ProductForm';

import FadeIn from 'animations/FadeIn';
import ScaleUp from 'animations/ScaleUp';

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
    background: hsl(110, 50%, 85%);
    border-radius: 3px;

    @media (min-width: 700px) {
      margin-top: -20vh;
    }
  }
`

class AddProduct extends Component {
  state = {
    name: '',
    description: '',
    price: '',
    quantity: 1,
    images: [],
    properties: [],
    showMessage: false,
  }

  handleDrop = images => {
    this.setState({ images });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  addProperty = property => {
    this.setState({ properties: [...this.state.properties, property] });
  }

  removeProperty = index => {
    const properties = [...this.state.properties];
    this.setState({ properties: properties.filter((p, i) => index != i) });
  }

  handleSubmit = e => {
    e.preventDefault();

    this.setState({ showMessage: false });

    const product = {
      id: this.props.id,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      quantity: this.state.quantity,
      productProperties: this.state.properties
    };

    const formData = new FormData();

    for (const image of this.state.images) {
      formData.append('file', image)
    }

    ProductApi.create(product)
      .then(added => (
        ProductApi.addImages(added.id, formData)
          .then(res => {
            this.props.productStore.getAll();
            this.setState({ showMessage: true });
            this.timeout = setTimeout(() => this.setState({ showMessage: false }), 1200)
          })
      ))
      .catch(error => console.error(error));
  }

  handleImageClick = name => this.setState({ images: this.state.images.filter(i => i.name !== name )});

  handleClose = () => {
    clearTimeout(this.timeout);
    this.setState({ showMessage: false });
  }

  render() {
    const { images, showMessage } = this.state;
    return (
      <Wrapper onSubmit={this.handleSubmit}>
        <ProductForm onChange={this.handleChange} {...this.state} addProperty={this.addProperty} removeProperty={this.removeProperty}/>

        <label>Images</label>
        <ImageSelect
          onDrop={this.handleDrop}
          images={images}
          onImageClick={this.handleImageClick}
        />

        <Add>Add product</Add>

        <FadeIn in={showMessage}>
          <Message onClick={this.handleClose}>
            <ScaleUp>
              <div>Added successfully!</div>
            </ScaleUp>
          </Message>
        </FadeIn>
      </Wrapper>
     )
  }
}

export default inject('productStore')(AddProduct);
