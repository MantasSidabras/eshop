import { observable, action, decorate } from 'mobx';

import ProductApi from '../api/ProductApi';

class ProductStore {
  products = [];
  product = {};

  getAll = () => {
    return ProductApi.getAll()
      .then(products => this.products = products)
      .catch(error => console.error(error))
  }

  getOne = id => {
    return ProductApi.getOne(id)
      .then(product =>
        {
          this.product = product;
          this.products.forEach((p, i) => { 
            if (p.id === product.id) {
              this.products[i] = product;
            }
          })
        })
      .catch(error => console.error(error))
  }
}

decorate(ProductStore, {
  products: observable,
  product: observable,
  getAll: action,
  getOne: action
})

export default new ProductStore();
