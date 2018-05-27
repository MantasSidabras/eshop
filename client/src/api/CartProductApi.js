import Config from './Config';
import AuthApi from './AuthApi';

class CartProductApi {
  getAll = () => {
    return fetch(Config.url + `/cartProduct`, {
      method: 'GET',
      headers: {
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    })
      .then(res => {
        if (res.status === 401){
          throw new Error('Unauthorized');
        } else{
          return res;
        }
      })
      .then(res => res.json())
  }

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
          const err = {
            status: res.status,
            message: 'Not enough items'
          }
          throw err;
        } else if (res.status === 401){
          const err = {
            status: res.status,
            message: 'Unauthorized'
          }
          throw err;
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
        const err = {
          status: res.status,
          message: 'Bad request'
        }
        throw err;
      } else if (res.status === 401){
        const err = {
          status: res.status,
          message: 'Unauthorized'
        }
        throw err;
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

  deleteAll = () => {
    return fetch(Config.url + `/cartProduct`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error('Unauthorized')
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
      .then(res => {
        if (res.status === 40) {
          throw new Error('Bad request')
        } else if (res.status === 401) {
          throw new Error('Unauthorized')
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }
}

export default new CartProductApi();
