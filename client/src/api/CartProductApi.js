import Config from './Config';
import AuthApi from './AuthApi';

class CartProductApi {
  add = productId => {
    return fetch(Config.url + `/cartProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      },
      body: JSON.stringify(productId)
    })
      .then(res => {
        if (res.status === 400) {
          throw new Error('Not enough items')
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  update = cartProduct => {
    return fetch(Config.url + '/cartProduct', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      },
      body: JSON.stringify(cartProduct)
    })
      .then(res => {
        if (res.status === 400) {
          throw new Error('Not enough items')
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  sync = cartProduct => {
    return fetch(Config.url + '/cartProduct/sync', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      },
      body: JSON.stringify(cartProduct)
    })
      .then(res => {
        if (res.status === 400) {
          throw new Error('Not enough items')
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  deleteById = id => {
    return fetch(Config.url + `/cartProduct/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      }
    })
      .then(res => res.json())
  }
}

export default new CartProductApi();
