import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

class CartItem extends Component {
  state = {
    error: false,
    errorMsg: ''
  }

  handleQuantityChange = e => {
    this.setState({ error: false });

    if (e.target.value < 1 || e.target.value === '') return;
    
    const cartProduct = { id: this.props.id, quantity: e.target.value };

    this.props.cartStore.updateCartProduct(cartProduct)
      .catch(error => {
        this.setState({ error: true, errorMsg: error.message });
        setTimeout(() => this.setState({ error: false }), 2500);
      });
  }

  handleDelete = () => {
    this.props.cartStore.deleteCartProductById(this.props.id);
  }

  render() {
    const { product, quantity } = this.props;
    const { error, errorMsg } = this.state;
    return (
      <div  style={{ display: 'flex', marginBottom: 3 }}>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 110,  textAlign: 'center' }}>{product.price.toFixed(2)} €</div>
        <span style={{ width: 70, textAlign: 'center', position: 'relative'}}>
          <input style={{ width: 50, border: '1px solid hsl(0, 0%, 75%)', padding: '5px 8px', borderRadius: 3 }} type="number" min="1" onChange={this.handleQuantityChange} value={quantity}/>
          {error && <div style={{ zIndex: 999, boxShadow: '0 1px 2px hsla(0, 0%, 0%, 0.2)', position: 'absolute', padding: 5, textAlign: 'center', background: 'hsl(0, 70%, 90%)', border: '1px solid hsl(0, 40%, 70%)', borderRadius: 3, width: 150, transform: 'translateX(-30px)', top: 30 }} >{errorMsg}</div>}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 110,  textAlign: 'center' }}>{(product.price * quantity).toFixed(2)} €</div>
        <i style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={this.handleDelete} className="fas fa-times fa-lg" title='Remove item' />
      </div>
    )
  }
}

export default inject('cartStore')(CartItem);