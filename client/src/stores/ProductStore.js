import { observable, action, decorate } from 'mobx';

import ProductApi from '../api/ProductApi';

class ProductStore {
  products = [];

  getAll = () => {
    return ProductApi.getAll()
      .then(products => this.products = products)
      .catch(error => console.error(error))
  }
}

decorate(ProductStore, {
  products: observable,
  getAll: action
})

export default new ProductStore();