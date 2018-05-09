import React, { Component } from 'react';
import styled from 'styled-components';
import Context from 'MyContext';

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

const Title = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

const CartWrapper = styled.div`
  width: 100%;
  max-width: 700px;
`

const CartItemsWrapper = styled.div`
  padding: 1rem;
  margin-bottom: 10px;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
`

const ButtonWrapper = styled.div`
  display: flex;
`

const Button = styled.button`
  padding: 7px 14px;
  width: 100px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;
`

const BackButton = Button.extend`
  background: hsl(0, 0%, 90%);
  margin-right: 10px;
  border: 1px solid hsl(0, 0%, 50%);

  &:hover {
    background: hsl(0, 0%, 87%);
  }

  &:active {
    background: hsl(0, 0%, 85%);
    transform: scale(0.98);
  }
`

const ClearButton = Button.extend`
  background: hsl(0, 70%, 65%);
  border: 1px solid hsl(0, 30%, 50%);

  &:hover {
    background: hsl(0, 65%, 60%);
  }

  &:active {
    background: hsl(0, 55%, 55%);
    transform: scale(0.98);
  }
`

const ProceedButton = Button.extend`
  margin-left: auto;
  background: hsl(110, 50%, 78%);
  border: 1px solid hsl(110, 30%, 50%);

  &:hover {
    background: hsl(110, 50%, 72%);
  }

  &:active {
    background: hsl(110, 45%, 67%);
    transform: scale(0.98);
  }
`

class CartItem extends Component {
  state = {
    err: false,
    errMsg: ''
  }

  handleQuantityChange = e => {
    this.setState({ err: false });

    if (e.target.value < 1 || e.target.value === '') {
      return;
    }

    const cartProduct = { id: this.props.id, quantity: e.target.value };

    fetch('http://localhost:8080/api/cartProduct', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cartProduct)
    })
      .then(res => {
        if (res.status == 400) {
          throw Error('Not enough items')
        } else {
          return res;
        }
      })
      .then(res => res.json())
      .then(res => this.props.fetchUser())
      .catch(err => {
        this.setState({ err: true, errMsg: err.message });
        setTimeout(() => this.setState({ err: false }), 2500);
      })
  }

  handleDelete = () => {
    fetch(`http://localhost:8080/api/cartProduct/${this.props.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => this.props.fetchUser())
  }

  render() {
    const { product, quantity } = this.props;
    return (
      <div  style={{ display: 'flex', marginBottom: 3 }}>
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>{product.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 110,  textAlign: 'center' }}>{product.price} €</div>
        <span style={{ width: 70, textAlign: 'center', position: 'relative'}}>
          <input style={{ width: 50, border: '1px solid hsl(0, 0%, 75%)', padding: '5px 8px', borderRadius: 3 }} type="number" min="1" onChange={this.handleQuantityChange} value={quantity}/>
          {this.state.err && <div style={{ zIndex: 999, boxShadow: '0 1px 2px hsla(0, 0%, 0%, 0.2)', position: 'absolute', padding: 5, textAlign: 'center', background: 'hsl(0, 70%, 90%)', border: '1px solid hsl(0, 40%, 70%)', borderRadius: 3, width: 150, transform: 'translateX(-30px)', top: 30 }} >{this.state.errMsg}</div>}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 110,  textAlign: 'center' }}>{(product.price * quantity).toFixed(2)} €</div>
        <i style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={this.handleDelete} className="fas fa-times fa-lg" title='Remove item' />
      </div>
    )
  }
} 

class CartItems extends Component {
  render() {
    return (
      <CartItemsWrapper>
        <Context.Consumer>
          {({ user, fetchUser }) => (
            <div>
              <div style={{ display: 'flex', marginBottom: 8, fontWeight: 'bold' }}>
                <div style={{ flexGrow: 1, textAlign: 'center' }}>Item</div>
                <div style={{ width: 110,  textAlign: 'center' }}>Unit Price</div>
                <div style={{ width: 70,  textAlign: 'center' }}>Units</div>
                <div style={{ width: 110,  textAlign: 'center', marginRight: 20 }}>Total Price</div>
              </div>

              {user && user.cartProductList.length === 0 && <p style={{textAlign: 'center', color: 'hsla(0, 0%, 0%, 0.6)'}}>Cart is empty</p> }
              {user && user.cartProductList.map(cp => <CartItem key={cp.id} {...cp} fetchUser={fetchUser} />)}

              {user && user.cartProductList.length !== 0 &&
                <div style={{ marginTop: 20, textAlign: 'right'}}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', marginLeft: 5}}>
                    {user.cartProductList.length === 1 && `Price: ${(user.cartProductList[0].product.price * user.cartProductList[0].quantity).toFixed(2)} €`}
                    {user.cartProductList.length > 1 && `Price: ${user.cartProductList.reduce((cp, next) => cp.product.price * cp.quantity + next.product.price * next.quantity ).toFixed(2)} €`}
                  </span>
                </div>
              }
            </div>
          )}
        </Context.Consumer>
      </CartItemsWrapper>
    )
  }
}

class Cart extends Component {
  handleRemoveAll = (id, fetchUser) => {
    fetch(`http://localhost:8080/api/user/${id}/cartProduct`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => fetchUser())
  }

  render() { 
    return ( 
      <Context.Consumer>
        {({ user, fetchUser }) => (
          <Wrapper>
            <Title>Your cart</Title>
            <CartWrapper>
              <div style={{ textAlign: 'right', marginBottom: 5 }}>Step 1/2</div>

              <CartItems />

              <ButtonWrapper>
                <BackButton><i className="fas fa-arrow-left"></i> Back</BackButton>
                <ClearButton onClick={() => this.handleRemoveAll(user.id, fetchUser)} >Clear Cart</ClearButton>
                <ProceedButton>Proceed <i className="fas fa-arrow-right"></i></ProceedButton>
              </ButtonWrapper>
            </CartWrapper>
          </Wrapper>
        )}
      </Context.Consumer>
    )
  }
}
 
export default Cart;