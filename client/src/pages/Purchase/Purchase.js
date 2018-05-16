import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect, Link } from 'react-router-dom';
import { inject } from 'mobx-react';

import PaymentApi from 'api/PaymentApi';


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
`

const Form = styled.form`
  width: 100%;
  max-width: 700px;
`

const BorderWrapper = styled.div`
  padding: 1rem;
  margin-bottom: 10px;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
`

const FormContainer = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  label {
    display: block;
    color: hsla(0, 0%, 0%, 0.85);
  }

  input {
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
`

const ButtonWrapper = styled.div`
  display: flex;
`

const BackButton = styled(Link)`
  padding: 7px 14px;
  width: 100px;
  color: hsla(0, 0%, 0%, 0.750);
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  text-align: center;
  text-decoration: none;
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;

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

const PurchaseButton = styled.button`
  padding: 7px 14px;
  width: 100px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;
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

const TotalPrice = styled.span`
  margin-left: 5px;
  font-Size: 1.2rem;
  font-weight: bold;
`

const isValidCreditCard = value => {
  // accept only digits, dashes or spaces
	if (/[^0-9-\s]+/.test(value)) return false;

	// The Luhn Algorithm. It's so pretty.
	let nCheck = 0, nDigit = 0, bEven = false;
	value = value.replace(/\D/g, "");

	for (let n = value.length - 1; n >= 0; n--) {
		let cDigit = value.charAt(n),
			  nDigit = parseInt(cDigit, 10);

		if (bEven) {
			if ((nDigit *= 2) > 9) nDigit -= 9;
		}

		nCheck += nDigit;
		bEven = !bEven;
	}

	return (nCheck % 10) === 0;
}

class Purchase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holder: props.userStore.fullName,
      address: props.userStore.user.address,
      zipCode: props.userStore.user.zipCode,
      number: '',
      exp_year: '',
      exp_month: '',
      ccv: '',
      err: false
    }
  }

  componentDidMount() {
    this.props.cartStore.getCart();
  }

  handleChange = e => {
    const { name, value } = e.target;

    if (name === 'number' && !(new RegExp(/^\d{0,16}$/).test(value))) {
      return;
    } 
    if (name === 'exp_year' && !(new RegExp(/^\d{0,4}$/).test(value))) {
      return;
    }
    if (name === 'exp_month' && !(new RegExp(/^\d{0,2}$/).test(value))) {
      return;
    }
    if (name === 'ccv' && !(new RegExp(/^\d{0,3}$/).test(value))) {
      return;
    }

    this.setState({ [name]: value });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ err: false });

    // TODO: in prod
    // if (!isValidCreditCard(this.state.number)) {
    //   return this.setState({ err: true });
    // }

    PaymentApi.pay(this.state)
      .then(res => console.log('bought'))
      .catch(error => console.error(error))
  }

  render() {
    const { cartProductList, sum } = this.props.cartStore;
    const { holder, address, zipCode, number, exp_year, exp_month, ccv, err } = this.state;

    if (this.props.userStore.isLoggedIn && cartProductList.length > 0) {
      return ( 
        <Wrapper>
          <Title>Purchase</Title>
          <Form onSubmit={this.handleSubmit}>
            <div style={{ textAlign: 'right', marginBottom: 5, color: 'hsla(0, 0%, 0%, 0.85)' }}>Step 2/2</div>
            <BorderWrapper>
              <FormContainer>
                <label htmlFor='holder'>Full name</label>
                <input type="text" id='holder' name='holder' required value={holder} onChange={this.handleChange}/>

                <label htmlFor='address'>Address</label>
                <input type="text" id='address' name='address' value={address} onChange={this.handleChange} required />

                <label htmlFor='zipCode'>Zip Code</label>
                <input type="text" id='zipCode' name='zipCode' value={zipCode} onChange={this.handleChange} required />

                <label style={{ marginTop: 10 }} htmlFor='number'>Card number</label>
                <input type="text" id='number' name='number' required value={number} onChange={this.handleChange}/>
                {err && <div style={{ marginTop: -13, marginBottom: 5, fontSize: '0.8rem', color: 'hsla(0, 90%, 40%, 0.85)'}}>Invalid credit card number</div>}

                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{ width: '45%' }}>
                    <label htmlFor='exp_year'>Exp. year</label>
                    <input type="text" id='exp_year' name='exp_year' required value={exp_year} onChange={this.handleChange}/>
                  </div>

                  <div style={{ width: '45%' }}>
                    <label htmlFor='exp_month'>Exp. month</label>
                    <input type="text" id='exp_month' name='exp_month' required value={exp_month} onChange={this.handleChange}/>
                  </div>
                </div>

                <div style={{ width: 50 }}>
                  <label htmlFor='ccv'>CCV</label>
                  <input type="text" id='ccv' name='ccv' required value={ccv} onChange={this.handleChange}/>
                </div>
              </FormContainer>
  
              <div style={{ marginTop: 20, textAlign: 'right'}}>
                <span>
                  Sum:
                  <TotalPrice>{sum}€</TotalPrice>
                </span>
              </div>
            </BorderWrapper>

            <ButtonWrapper>
              <BackButton to='/cart'><i className="fas fa-arrow-left"></i> Back</BackButton>
              <PurchaseButton>Purchase</PurchaseButton>
            </ButtonWrapper>
          </Form>
        </Wrapper>
      )
    } else {
      return <Redirect to='/'/>
    }
  }
}
 
export default inject('cartStore', 'userStore')(Purchase);