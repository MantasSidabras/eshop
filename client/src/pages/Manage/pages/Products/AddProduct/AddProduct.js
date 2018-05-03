import React, { Component } from 'react';
import styled from 'styled-components';
import Dropzone from 'react-dropzone';

import { formatBytes } from '../../../../../utils';

const Container = styled.div`
  width: 100%;
  max-width: 350px;
  margin: 0 auto;

  label {
    display: block;
    color: hsla(0, 0%, 0%, 0.85);
  }

  input, textarea {
    width: 100%;
    padding: 3px;
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

const Wrapper = styled.form`
  width: 100%;
  max-width: 650px;
`

const StyledDropzone = styled(Dropzone)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 250px;
  padding: 10px;
  color: hsla(0, 0%, 0%, 0.6);
  border: 2px dashed hsl(0, 0%, 75%);
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out; 

  :hover {
    background-color: hsl(210, 80%, 96%);
  }
`

const Add = styled.button`
  padding: 7px 14px;
  margin-top: 10px;
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

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 32%;
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
  ${props => props.bold && 'font-weight: bold;'}
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
    const formData = new FormData();

    const product = {
      name: this.state.name,
      description: this.state.description,
      price: this.state.price,
      quantity: this.state.quantity
    }

    for (const image of this.state.images) {
      formData.append('file', image)
    }

    fetch('http://localhost:8080/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then(added => (
        fetch(`http://localhost:8080/api/product/${added.id}/images`, {
          method: 'POST',
          body: formData
        })
          .then(res => res.json())
          .then(res => {
            alert(res.message);
            this.props.fetchAllProducts();
          })
      ))
      .catch(error => console.error(error));
  }
   
  handleImageClick = (e, name) => {
    e.stopPropagation();
    this.setState({ images: this.state.images.filter(i => i.name !== name )});
  }

  render() { 
    const { name, description, price, quantity, images } = this.state;
    return ( 
      <Wrapper onSubmit={this.handleSubmit}>
        <Container>
          <label htmlFor='name'>Name</label>
          <input name='name' value={name} onChange={this.handleChange} id='name' type="text" required />

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ width: '45%' }}>
              <label htmlFor='price'>Price</label>
              <input name='price' onChange={this.handleChange} value={price} id='price' type="number" required min='0' step="0.01" />
            </div>

            <div style={{ width: '45%' }}>
              <label htmlFor='quant'>Quantity</label>
              <input name='quantity' onChange={this.handleChange} value={quantity} id='quant' type="number" required min='0' />
            </div>
          </div>

          <label htmlFor='desc'>Description <span style={{fontSize: '0.8rem', color: 'hsla(0, 0%, 0%, 0.6)', fontStyle: 'italic'}}>(optional)</span></label>
          <textarea name='description' onChange={this.handleChange} value={description} id='desc' />

          <label>Images</label>
        </Container>

        <StyledDropzone
          accept="image/*"
          onDrop={this.handleDrop}
          acceptStyle={{ border: '3px solid hsl(110, 50%, 80%)', background: 'hsl(110, 50%, 97%)'}}
          rejectStyle={{ border: '3px solid hsl(00, 50%, 80%)', background: 'hsl(0, 50%, 97%)'}}
        >
          {images.length === 0 && 
            <div style={{marginTop: 0, marginBottom: 10}}>
              Drop images here or click to select
            </div>
          }

          <Images>
            {images.map(i => 
              <ImageWrapper key={i.name}>
                <Image onClick={e => this.handleImageClick(e, i.name)} alt={i.name} src={i.preview}/>
                <ImageInfo bold>{i.name}</ImageInfo>
                <ImageInfo>{formatBytes(i.size)}</ImageInfo>
              </ImageWrapper>
            )}
          </Images>
        </StyledDropzone>

        <Container>
          <Add>Add product</Add>
        </Container> 
      </Wrapper>
     )
  }
}
 
export default AddProduct;