import AuthApi from './AuthApi';
import Config from './Config';

class OrderApi {

  getAll = () => {
    return fetch(Config.url + '/order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      }
    })
      .then(async res => {
        if (res.status >= 400) {
          const err = await res.json();
          throw new Error(err.message);
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  create = paymentInfo => {
    return fetch(Config.url + '/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      },
      body: JSON.stringify(paymentInfo)
    })
      .then(async res => {
        if (res.status >= 400) {
          const err = await res.json();
          err.status = res.status;
          throw err;
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  update = order => {
    return fetch(Config.url + '/order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      },
      body: JSON.stringify(order)
    })
      .then(res => {
        if (res.status === 400) {
          throw new Error('Bad request')
        } else if(res.status === 401){
          throw new Error('Unautherized access')
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  rate = (id, rating) => {
    return fetch(`${Config.url}/order/${id}/rating`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AuthApi.getToken()}`
      },
      body: JSON.stringify(rating)
    })
      .then(res => {
        if (res.status === 400) {
          throw new Error('Bad request')
        } else if(res.status === 401){
          throw new Error('Unautherized access')
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }
}

export default new OrderApi();
