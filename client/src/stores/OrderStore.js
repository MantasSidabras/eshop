import { observable, action, decorate } from 'mobx';

import OrderApi from '../api/OrderApi';

class OrderStore {
  orders = [];

  getAll = () => {
    return OrderApi.getAll()
      .then(orders => this.orders = orders)
      .catch(error => console.error(error))
  }
}

decorate(OrderStore, {
  orders: observable,
  getAll: action
})

export default new OrderStore();