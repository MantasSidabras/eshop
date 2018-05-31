import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import ProductImageApi from 'api/ProductImageApi';

const Wrapper = styled.div`
  justify-content: center;
  display: flex;
  align-items: flex-start;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: center;
  }

  > div {
    font-family: 'Roboto', sans-serif;
    max-width: 500px;
    border-radius: 3px;
  }

  .main {
    width: 100%;
    max-width: 300px;
    margin-right: 2rem;
    margin-bottom: 2rem;
    flex-shrink: 1;

    @media (max-width: 650px) {
      margin-right: 0;
    }

  }

  .info {
    width: 100%;
    max-width: 350px;
    padding: 1rem;
    flex-shrink: 1;
    box-shadow: 0 1px 2px hsla(0,0%,0%, 0.2);

    @media (min-width: 650px) {
      min-width: 280px;
    }
  }

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 3px;
  }

  table {
    width: 100%;
  }

  td.value_field {
    width: 50%;
    text-align: right;
  }
`
const ImageWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 320px;
  margin-bottom: 10px;
  box-shadow: 0 1px 2px hsla(0,0%,0%, 0.2);
`

const MiniImageWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 31%;
  cursor: pointer;
  margin-bottom: 5px;
  margin-right: 5px;
  transition: box-shadow 0.1s ease-in-out;

  ${props => props.active && 'box-shadow: 0 1px 2px hsla(0,0%,0%, 0.2);'}

  :hover {
    box-shadow: 0 1px 2px hsla(0,0%,0%, 0.2);
  }
`

const Name = styled.div`
  overflow: hidden;
  width: 100%;
  font-size: calc(1.2rem + 0.3vw);
  margin-bottom: 5px;
  text-align: center;
  color: hsla(0, 0%, 0%, 0.85);
`;

const Description = styled.div`
  margin: 20px 0;
`

const Price = styled.div`
  margin: 10px 0;
  font-weight: bold;
  font-size: 1.5rem;
`;

const Quantity = styled.div`
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

const NotFound = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${props => props.marginBottom && `margin-bottom: ${props.marginBottom}px;`}
`
class ProductInfo extends Component {
  state = {
    loading: true,
    activeImageId: null
  }

  componentDidMount() {
    this.props.productStore.getOne(this.props.match.params.id)
      .then(() => this.setState({ loading: false, activeImageId: this.props.productStore.product.productImages[0].id }));
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
    this.setState({ activeImageId: id })
  }

  render() {
    if (!this.state.loading && this.props.productStore.product !== null) {
      const { name, price, quantity, productImages, description, productProperties, skuCode } = this.props.productStore.product;

      const { activeImageId } = this.state;

      return (
        <Wrapper>
          <div className="main">
            {productImages.length > 0 
              ? <ImageWrap>
                  <img src={ProductImageApi.get(activeImageId)} alt={name}/>
                </ImageWrap> 
              : <Placeholder><Text>No image</Text></Placeholder>
            }
            <div style={{ display: 'flex', flexWrap: 'wrap'}}>
              {productImages.map(i => 
                <MiniImageWrap active={activeImageId === i.id} key={i.id} onClick={() => this.setImage(i.id)}>
                  <img src={ProductImageApi.get(i.id)} alt={name}/>
                </MiniImageWrap>
              )}
            </div>
          </div>
          <div className="info">
            <Name>{name}</Name>
            <Description>{description}</Description>
            
            {skuCode &&
              <Row marginBottom={15}>
                <div style={{ fontWeight: 'bold'}}>SKU#:</div>
                <div>{skuCode}</div>
              </Row>
            }
            
            {productProperties.map(property => (
              <Row key={property.name} marginBottom={3}>
                <div style={{ fontWeight: 'bold'}}>{property.name}:</div>
                <div style={{ textAlign: 'right' }}>{property.value}</div>
              </Row>
            ))}

            <Row>
              <Price>{price.toFixed(2)}€</Price>
              <Quantity>{quantity > 0 ? 'In stock' : 'Out of stock'}</Quantity>
            </Row>
    
            <Button disabled={quantity === 0} onClick={this.handleAdd}>Add to cart</Button>
          </div>
        </Wrapper>
      )
    } else if (!this.state.loading && this.props.productStore.product == null) {
      return (
        <Wrapper>
          <NotFound>Product not found</NotFound>
        </Wrapper>
      )
    } else {
      return <Wrapper />
    }
  }
}

export default inject('productStore', 'cartStore')(observer(ProductInfo));
