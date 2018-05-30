import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import ProductImageApi from 'api/ProductImageApi';

const Wrapper = styled.div`
  justify-content: center;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;

  > div {
    font-family: 'Roboto', sans-serif;
    margin: 0 10px;
    max-width: 500px;
    border-radius: 3px;
  }

  .main {
    width: 100%;
    max-width: 300px;
    text-align: center;
    margin-bottom: 2rem;
  }

  .info {
    width: 100%;
    max-width: 300px;
    padding: 1rem;
    box-shadow: 0 1px 2px hsla(0,0%,0%, 0.2);
  }

  img {
    width: 100%;
    border-radius: 3px;
    height: auto;
    box-shadow: 0 1px 2px hsla(0,0%,0%, 0.2);
  }

  table {
    width: 100%;
    margin: 10px 0;
    box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
    background: hsl(0,0%,98%);
    padding: 5px 5px;
    border-radius: 3px;
  }
  td {
    font-size: 1rem;
    padding-bottom: 5px;
  }

  td.name_field {
  }

  td.value_field {
    width: 20px;
    text-align: right;
  }
`

const Name = styled.div`
  overflow: hidden;
  width: 100%;
  font-size: calc(1rem + 0.4vw);
  margin-bottom: 5px;
  text-align: center;
  color: hsla(0, 0%, 0%, 0.85);

`;

const Description = styled.div`
  margin: 15px 0;
  font-size: 0.9rem;
`

const Price = styled.div`
  margin: 10px 0;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Quantity = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const Placeholder = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100%;
  width: 100%;
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
  box-shadow: 0 1px 1px hsla(0,0%,0%, 0.2);
`;

const Text = styled.div`
  position:absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
`

const Button = styled.button`
  width: 100%;
  padding: 7px 14px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  background: hsl(110, 60%, 75%);
  border: 1px solid hsl(110, 35%, 55%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;

  ${props => props.disabled ? `cursor: not-allowed;` : `
    &:hover {
      background: hsl(110, 50%, 72%);
    }

    &:active {
      background: hsl(110, 45%, 67%);
      transform: scale(0.98);
    }
  `}
`

class ProductInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      image: null
    }
  }

  componentDidMount() {
    this.props.productStore.getOne(this.props.match.params.id)
      .then(() => this.setState({ loading: false }));
  }

  handleAdd = () => {
    this.props.cartStore.addProductToCart(this.props.productStore.product)
      .catch(error => {
        console.error(error.message);
        if (error.status === 401) {
          this.props.userStore.logout();
          return this.props.history.push('/login');
        }
      });
  }
  
  setImage = id => {
    this.setState({ imageId: id })
  }

  render(){
    const { name, price, quantity, productImages, description, productProperties, deleted } = this.props.productStore.product;

    const { imageId } = this.state;
    
    if (!this.state.loading) {
      return (
        <Wrapper>
          <div className="main">
            {productImages && productImages.length > 0 ? <img src={ProductImageApi.get(imageId || productImages[0].id)} alt={name}/> : <Placeholder><Text>No image</Text></Placeholder>}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
              {productImages && productImages.filter(i => i.id != imageId).map(i => 
                <div key={i.id} onClick={() => this.setImage(i.id)} style={{ width: '32%', cursor: 'pointer',marginBottom: 5}}>
                  <img src={ProductImageApi.get(i.id)} alt={name}/>
                </div>
              )}
            </div>
          </div>
          <div className="info">
            <Name>{name}</Name>
            <Description>{description}</Description>
            
            <Quantity>{quantity > 0 && !deleted ? 'In stock' : 'Out of stock'}</Quantity>

            {productProperties.length > 0 && (
              <table>
                {productProperties.map(property => (
                  <tr>
                    <td className="name_field">
                      {property.name}:
                    </td>
                    <td className="value_field">
                      <strong>{property.value}</strong>
                    </td>
                  </tr>
                ))}
              </table>
            )}
            <Price>{price.toFixed(2)}€</Price>
            <Button disabled={deleted || quantity === 0} onClick={this.handleAdd}>Add to cart</Button>
          </div>
        </Wrapper>
      )
    } else return <Wrapper/>
  }
}

export default inject('productStore', 'cartStore')(observer(ProductInfo));
