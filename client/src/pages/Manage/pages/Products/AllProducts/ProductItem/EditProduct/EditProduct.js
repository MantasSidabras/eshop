import React, { Component } from 'react';
import styled from 'styled-components';

import ImageSelect from 'components/ImageSelect';
import ProductForm from 'components/ProductForm';
import ScaleUp from 'animations/ScaleUp';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  background: hsla(0, 0%, 0%, 0.6);
  z-index: 999;
  overflow-y: scroll;
`

const Form = styled.form`
  width: 100%;
  max-width: 450px;
  padding: 1rem;
  margin: 0 auto;
  background: hsl(0, 0%, 100%);
  border-radius: 3px;
`

const Button = styled.button`
  padding: 7px 14px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
`

const Save = Button.extend`
  margin-right: 10px;
  background: hsl(110, 50%, 78%);
  border: 1px solid hsl(110, 30%, 50%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  transition: 0.2s ease-in-out;

  &:hover {
    background: hsl(110, 50%, 72%);
  }

  &:active {
    background: hsl(110, 45%, 67%);
    transform: scale(0.98);
  }
`

const Cancel = Button.extend`
  background: none;
  border: none;
  box-shadow: none;
`

class EditProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: props.name,
      description: props.description,
      price: props.price,
      quantity: props.quantity,
      properties: props.properties || [],
      oldImages: props.productImages,
      version: props.version,
      images: [],
      imageIdsToDelete: []
    };
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
    const { imageIdsToDelete, images } = this.state;
    const product = {
      id: this.props.id,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      quantity: this.state.quantity,
      version: this.state.version,
      productProperties: this.state.properties
    };

    this.props.onEdit({ product, imageIdsToDelete, images });
  }

  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }

  handleOldImageClick = id => {
    this.setState({ imageIdsToDelete: [...this.state.imageIdsToDelete, id], oldImages: this.state.oldImages.filter(i => i.id !== id )});
  }

  handleNewImageClick = name => {
    this.setState({ images: this.state.images.filter(i => i.name !== name )});
  }

  addProperty = property => {
    this.setState({ properties: [...this.state.properties, property] });
  }

  removeProperty = index => {
    const properties = [...this.state.properties];
    this.setState({ properties: properties.filter((p, i) => index !== i) });
  }

  componentWillReceiveProps(props){
    this.setState({
      name: props.name,
      description: props.description,
      price: props.price,
      quantity: props.quantity,
      oldImages: props.productImages,
      properties: props.productProperties,
      version: props.version
    }
    );
  }

  render() {
    const { oldImages, images } = this.state;
    return (
      <Wrapper onClick={this.handleCancel}>
        <ScaleUp>
          <Form onClick={e => e.stopPropagation()} onSubmit={this.handleSubmit}>
            <ProductForm onChange={this.handleChange} {...this.state} addProperty={this.addProperty} removeProperty={this.removeProperty} />

            <label>Images</label>
            <ImageSelect
              onDrop={this.handleDrop}
              images={images}
              onImageClick={this.handleNewImageClick}
              oldImages={oldImages}
              onOldImageClick={this.handleOldImageClick}
            />

            <Save>Save</Save>
            <Cancel onClick={this.handleCancel}>Cancel</Cancel>
          </Form>
        </ScaleUp>
      </Wrapper>
    );
  }
}

export default EditProduct;
