import AuthApi from './AuthApi';

class OrderApi {

  getAll = () => {
    return fetch('http://localhost:8080/api/order', {
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
    return fetch('http://localhost:8080/api/order', {
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
          throw new Error(err.message);
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  update = order => {
    return fetch('http://localhost:8080/api/order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then(res => {
        if (res.status === 400) {
          throw new Error('Bad request')
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }
}

export default new OrderApi();