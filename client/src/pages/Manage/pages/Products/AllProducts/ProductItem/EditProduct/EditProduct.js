import React, { Component } from 'react';
import styled from 'styled-components';

import ScaleUp from 'animations/ScaleUp';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: hsla(0, 0%, 0%, 0.6);
  z-index: 999;
`

const Form = styled.form`
  width: 100%;
  max-width: 350px;
  padding: 1rem;
  margin-top: -20vh;
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

class EditProduct extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: props.name,
      description: props.description,
      price: props.price,
      quantity: props.quantity
    }
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();
    const product = { id: this.props.id, ...this.state };
    this.props.onEdit(product);
  }

  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  }

  render() {
    const { name, description, price, quantity } = this.state;
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

            <Save>Save</Save>
            <Cancel onClick={this.handleCancel}>Cancel</Cancel>
          </Form>
        </ScaleUp>
      </Wrapper>
    );
  }
}

export default EditProduct;
