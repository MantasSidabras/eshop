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
const PropertyBox = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  border: 1px solid hsl(0, 0%, 75%);
  padding: 3px 8px;
  border-radius: 3px;
  box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.08);
  margin-bottom: 15px;

`

const AddProp = styled.button`
  padding: 6px 12px;
  margin-bottom: 15px;
  background: hsl(0, 0%, 88%);
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  border: 1px solid hsl(0, 0%, 50%);
  border-radius: 3px;
  cursor: pointer;
  transition: 0.2s ease-in-out;

  &:hover {
    background: hsl(0, 0%, 83%);
  }
`

class ProductForm extends Component {
  state = {
    name: '',
    value: ''
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  addProperty = e => {
    e.preventDefault();

    if (this.state.name.trim() === '' || this.state.value.trim() === '') {
      return;
    }

    this.props.addProperty(this.state)
  }

  render() {
    const { name, price, quantity, properties, description, onChange } = this.props;
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

        <label style={{ marginBottom: 5 }}>Add properties <span style={{ fontSize: '0.8rem', color: 'hsla(0, 0%, 0%, 0.6)', fontStyle: 'italic' }}>(optional)</span></label>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <div style={{ width: '45%' }}>
            <label htmlFor='price'>Property name</label>
            <input type="text" id='propertyName' name='name' value={this.state.name} onChange={this.onChange}/>
          </div>

          <div style={{ width: '45%' }}>
            <label htmlFor='quant'>Property value</label>
            <input type="text" id='propertyValue' name='value' value={this.state.value} onChange={this.onChange}/>
          </div>
        </div>
		    <AddProp onClick={this.addProperty}>Add property</AddProp>
        {properties && properties.length > 0 && 
          <PropertyBox>
            {properties.map((property, index) => 
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0'}}>
                <div style={{ marginRight: 10}}>
                  <b>{property.name}:</b></div>
                <div style={{ display: 'flex',alignItems: 'center' }}>
                  <span style={{ marginRight: 15 }}>{property.value}</span>
                  <i style={{ fontSize: '1.1rem', cursor: 'pointer'}} className="fas fa-times" onClick={() => this.props.removeProperty(index)}/>
                </div>
              </div>
            )}
          </PropertyBox>
        }
      </Wrapper>
    )
  }
}

export default ProductForm;
