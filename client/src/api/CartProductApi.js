import Config from './Config';

class CartProductApi {
  add = cartProduct => {
    return fetch(Config.url + `/cartProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

  update = cartProduct => {
    return fetch(Config.url + '/cartProduct', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
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
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
  }
}

export default new CartProductApi();
