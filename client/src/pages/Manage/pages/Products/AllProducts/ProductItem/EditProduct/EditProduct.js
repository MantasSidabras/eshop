import React, { Component } from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';

import ScaleUp from 'animations/ScaleUp';
import { formatBytes } from 'utils';

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
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  background: hsl(0, 0%, 100%);
  border-radius: 3px;

  label {
    display: block;
    color: hsla(0, 0%, 0%, 0.85);
  }

  input, textarea {
    width: 100%;
    padding: 5px;
    margin-bottom: 15px;
    font-family: 'Roboto', sans-serif;
    font-size: 0.9rem;
    color: hsla(0, 0%, 0%, 0.75);
    border: 1px solid hsl(0, 0%, 75%);
    border-radius: 3px;
    box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.08);
  }

  textarea {
    height: 100px;
    resize: none;
  }
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

const StyledDropzone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 250px;
  padding: 10px;
  margin-bottom: 20px;
  color: hsla(0, 0%, 0%, 0.6);
  border: 2px dashed hsl(0, 0%, 75%);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out; 

  :hover {
    background-color: hsl(210, 80%, 96%);
  }
`

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 30%;
  margin-bottom: 5px;
  margin-right: 7px;
  font-size: 0.8rem;
  text-align: center;
  border-radius: 3px;
  z-index: 1;
`

const Image = styled.img`
  width: 100%;
  margin-bottom: 5px;
  border-radius: 3px;
`

const ImageInfo = styled.div`
  margin-bottom: 2px;
  color: hsla(0, 0%, 0%, 0.75);
  overflow: hidden;
  ${props => props.bold && 'font-weight: bold;'}
`

class EditProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: props.name,
      description: props.description,
      price: props.price,
      quantity: props.quantity,
      productImages: props.productImages,
      newImages: [],
      imageIdsToDelete: []
    };
  }

  handleDrop = newImages => { 
    this.setState({ newImages });
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { imageIdsToDelete, newImages } = this.state;
    const product = { 
      id: this.props.id,
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      quantity: this.state.quantity
    };
    
    this.props.onEdit({ product, imageIdsToDelete, newImages });
  }

  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }

  handleProductImageClick = (e, id) => {
    e.stopPropagation();
    this.setState({ imageIdsToDelete: [...this.state.imageIdsToDelete, id], productImages: this.state.productImages.filter(i => i.id !== id )});
  }

  handleNewImageClick = (e, name) => {
    e.stopPropagation();
    this.setState({ newImages: this.state.newImages.filter(i => i.name !== name )});
  }

  render() {
    const { name, description, price, quantity, productImages, newImages } = this.state;
    return (
      <Wrapper onClick={this.handleCancel}>
        <ScaleUp>
          <Form onClick={e => e.stopPropagation()} onSubmit={this.handleSubmit}>
            <label htmlFor='name'>Name</label>
            <input type="text" id='name' name='name' value={name} onChange={this.handleChange} required />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
              <div style={{ width: '45%' }}>
                <label htmlFor='price'>Price</label>
                <input type="number" id='price' name='price' value={price} onChange={this.handleChange} required min='0' step="0.01" />
              </div>

              <div style={{ width: '45%' }}>
                <label htmlFor='quant'>Quantity</label>
                <input type="number" id='quant' name='quantity' value={quantity} onChange={this.handleChange} required min='0' />
              </div>
            </div>

            <label htmlFor='desc'>Description <span style={{ fontSize: '0.8rem', color: 'hsla(0, 0%, 0%, 0.6)', fontStyle: 'italic' }}>(optional)</span></label>
            <textarea id='desc' name='description' value={description} onChange={this.handleChange} />

            <StyledDropzone
              accept="image/*"
              onDrop={this.handleDrop}
              acceptStyle={{ border: '3px solid hsl(110, 50%, 80%)', background: 'hsl(110, 50%, 97%)'}}
              rejectStyle={{ border: '3px solid hsl(00, 50%, 80%)', background: 'hsl(0, 50%, 97%)'}}
            >
              {productImages.length === 0 && newImages.length === 0 && 
                <div style={{marginTop: 0, marginBottom: 10}}>
                  Drop images here or click to select
                </div>
              }

              <Images>
                {productImages.map(i => 
                  <ImageWrapper key={i.name}>
                    <Image onClick={e => this.handleProductImageClick(e, i.id)} alt={i.name} src={`http://localhost:8080/api/product-image/${i.id}`}/>
                    <ImageInfo bold>{i.name}</ImageInfo>
                  </ImageWrapper>
                )}
                {newImages.map(i => 
                  <ImageWrapper key={i.name}>
                    <Image onClick={e => this.handleNewImageClick(e, i.name)} alt={i.name} src={i.preview}/>
                    <ImageInfo bold>{i.name}</ImageInfo>
                    <ImageInfo>{formatBytes(i.size)}</ImageInfo>
                  </ImageWrapper>
                )}
              </Images>
            </StyledDropzone>

            <Save>Save</Save>
            <Cancel onClick={this.handleCancel}>Cancel</Cancel>
          </Form>
        </ScaleUp>
      </Wrapper>
    );
  }
}

export default EditProduct;
