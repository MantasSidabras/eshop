import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
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

class ProductForm extends Component {
  render() { 
    const { name, price, quantity, description, onChange } = this.props;
    return ( 
      <Wrapper>
        <label htmlFor='name'>Name</label>
        <input type="text" id='name' name='name' value={name} onChange={onChange} required />

        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <div style={{ width: '45%' }}>
            <label htmlFor='price'>Price</label>
            <input type="number" id='price' name='price' value={price} onChange={onChange} required min='0' step="0.01" />
          </div>

          <div style={{ width: '45%' }}>
            <label htmlFor='quant'>Quantity</label>
            <input type="number" id='quant' name='quantity' value={quantity} onChange={onChange} required min='0' />
          </div>
        </div>

        <label htmlFor='desc'>Description <span style={{ fontSize: '0.8rem', color: 'hsla(0, 0%, 0%, 0.6)', fontStyle: 'italic' }}>(optional)</span></label>
        <textarea id='desc' name='description' value={description} onChange={onChange} />
      </Wrapper> 
    )
  }
}
 
export default ProductForm;