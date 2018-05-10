import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import ProductApi from 'api/ProductApi';
import ProductImageApi from 'api/ProductImageApi';
import EditProduct from './EditProduct/EditProduct';
import ConfirmDelete from './ConfirmDelete/ConfirmDelete';
import FadeIn from 'animations/FadeIn';

const Wrapper = styled.div`
  width: 100%;

  &:last-child {
    border-bottom: 1px solid hsl(0, 0%, 85%);
  }
`

const Product = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 10px;
  background: hsl(0, 0%, 99%);
  border-top: 1px solid hsl(0, 0%, 85%);
  border-right: 1px solid hsl(0, 0%, 85%);
  border-left: 3px solid hsl(210, 60%, 60%);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: hsl(0, 0%, 100%);
    transform: scale(1.01)
  }
`

const Name = styled.div`
  flex-grow: 1;
`

class ProductItem extends Component {
  state = { 
    showIcons: false, 
    showEdit: false,
    showConfirm: false
  }

  showIcons = () => {
    if(!this.state.showIcons) {
      this.setState({ showIcons: true });
    }
  }
  
  hideIcons = () => this.setState({ showIcons: false });

  toggleShowEdit = () => this.setState(state => ({ showEdit: !state.showEdit }));
  
  showConfirm = () => this.setState({ showConfirm: true });
  
  handleEdit = ({ product, imageIdsToDelete, images }) => {
    const formData = new FormData();

    for (const image of images) {
      formData.append('file', image)
    }

    Promise.all([
      ProductApi.update(product),
      ProductApi.addImages(product.id, formData),
      ...imageIdsToDelete.map(id => ProductImageApi.delete(id))  
    ])
      .then(() => {
        this.setState({ showEdit: false });
        this.props.productStore.getAll();
      })
      .catch(error => console.error(error));
  }

  handleDelete = () => {
    ProductApi.delete(this.props.id)
      .then(() => {
        this.setState({ showConfirm: false });
        this.props.productStore.getAll();
      })
      .catch(error => console.error(error));
  }

  handleCancel = () => this.setState({ showEdit: false, showConfirm: false });

  render() {
    const { name } = this.props;
    const { showIcons, showEdit, showConfirm } = this.state;
    return ( 
      <Wrapper>
        <Product
          onMouseOver={this.showIcons} 
          onMouseLeave={this.hideIcons}
        >
          <Name>{name}</Name>
          <FadeIn in={showIcons} enterDuration={200} exitDuration={200}>
            <div>
              <i style={{marginRight: 10}} title="Edit" className="fas fa-edit fa-lg" onClick={this.toggleShowEdit} />
              <i title="Delete" className="fas fa-trash-alt fa-lg" onClick={this.showConfirm} />
            </div>
          </FadeIn>
        </Product>

        <FadeIn in={showEdit}>
          <EditProduct {...this.props} onEdit={this.handleEdit} onCancel={this.handleCancel}/>
        </FadeIn>

        <FadeIn in={showConfirm}>
          <ConfirmDelete name={name} onDelete={this.handleDelete} onCancel={this.handleCancel}/>
        </FadeIn>
      </Wrapper> 
    )
  }
}
 
export default inject('productStore')(ProductItem);