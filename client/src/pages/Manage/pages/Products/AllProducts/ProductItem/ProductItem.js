import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import ProductApi from 'api/ProductApi';
import ProductImageApi from 'api/ProductImageApi';
import EditProduct from './EditProduct/EditProduct';
import ConfirmDelete from './ConfirmDelete/ConfirmDelete';
import ConfirmOverwrite from './ConfirmOverwrite/ConfirmOverwrite';

import FadeIn from 'animations/FadeIn';
import ScaleUp from 'animations/ScaleUp';

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

const Message = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: hsla(0, 0%, 0%, 0.6);
  z-index: 999;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 3rem;
    background: hsl(110, 50%, 85%);
    ${props => props.error ? 'background: hsl(0, 50%, 95%);' : 'background: hsl(110, 50%, 85%);'};
    border-radius: 3px;
    @media (min-width: 700px) {
      margin-top: -20vh;
    }
  }
`

class ProductItem extends Component {
  state = {
    showIcons: false,
    showEdit: false,
    showConfirm: false,
    showMessage: false,
    showError: false,
    errMsg: '',
    err: false
  }

  showIcons = () => {
    if(!this.state.showIcons) {
      this.setState({ showIcons: true });
    }
  }

  navigate = () => {
    this.props.history.push(`/product/${this.props.id}`);
  }

  hideIcons = () => this.setState({ showIcons: false });

  toggleShowEdit = e => {
    e.stopPropagation();
    this.setState(state => ({ showEdit: !state.showEdit }));
  }

  showConfirm = e => {
    e.stopPropagation();
    this.setState({ showConfirm: true });
  }

  handleEdit = ({ product, imageIdsToDelete, images }) => {
    const formData = new FormData();
    this.product = product;
    this.imageIdsToDelete = imageIdsToDelete;
    this.images = images;
    for (const image of images) {
      formData.append('file', image)
    }

    Promise.all([
      ProductApi.update(product),
      ProductApi.addImages(product.id, formData),
      ...imageIdsToDelete.map(id => ProductImageApi.delete(id))
    ])
      .then(() => {
        this.props.productStore.getAll();
        this.setState({ showMessage: true, showError: false, err: false });
        this.timeout = setTimeout(() => this.setState({ showEdit: false, showMessage: false }), 1200)
      })
      .catch(error => {
        console.error(error);
        this.setState({ showMessage: true, showError: true, errMsg: error.message, err: true });
        this.timeout = setTimeout(() => this.setState({ showMessage: false}), 3000);
        //this.props.productStore.getOne(this.props.id);
      });
  }

  handleRefresh = () => {
    this.setState({ showMessage: false, showError: false, err: false });
    this.props.productStore.getOne(this.props.id);
  }

  handleOverwrite = async () => {

    const prod = await ProductApi.getOne(this.product.id);
    this.product.version = prod.version;

    const formData = new FormData();
    for (const image of this.images) {
      formData.append('file', image)
    }
    Promise.all([
      ProductApi.update(this.product),
      ProductApi.addImages(this.product.id, formData),
      ...this.imageIdsToDelete.map(id => ProductImageApi.delete(id))
    ])
    .then(() => {
      this.props.productStore.getAll();
      this.setState({ showMessage: true, showError: false, err: false });
      this.timeout = setTimeout(() => this.setState({ showEdit: false, showMessage: false }), 1200)
    })
    .catch(error => {
      console.error(error);
      this.setState({ showMessage: true, showError: true, errMsg: error.message, err: true });
      this.timeout = setTimeout(() => this.setState({ showMessage: false}), 3000);
      //this.props.productStore.getOne(this.props.id);
    });

    this.setState({ showMessage: true, showError: false, err: false });

  }

  handleDelete = e => {
    e.stopPropagation();
    ProductApi.delete(this.props.id)
      .then(() => {
        this.props.productStore.getAll();
        this.setState({ showConfirm: false });
      })
      .catch(error => console.error(error));
  }

  handleCancel = e => {
    this.setState({ showEdit: false, showConfirm: false });
  }

  handleClose = e => {
    clearTimeout(this.timeout);
    this.setState({ showEdit: false, showMessage: false });
  }

  render() {
    const { name } = this.props;
    const { showIcons, showEdit, showConfirm, showMessage } = this.state;
    return (
      <Wrapper >
        <Product
          onMouseOver={this.showIcons}
          onMouseLeave={this.hideIcons}
          onClick={this.navigate}
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

        <FadeIn in={showMessage && !this.state.err}>
          <Message onClick={this.handleClose}>
            <ScaleUp>
              <div>Edited successfully!</div>
            </ScaleUp>
          </Message>
        </FadeIn>

          <FadeIn in={this.state.err}>
            <ConfirmOverwrite handleOverwrite={this.handleOverwrite} handleRefresh={this.handleRefresh}/>
          </FadeIn>

      </Wrapper>
    )
  }
}

export default inject('productStore')(observer(ProductItem));
