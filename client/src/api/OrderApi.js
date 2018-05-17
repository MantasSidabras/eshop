import AuthApi from './AuthApi';

class OrderApi {
  create = paymentInfo => {
    // TODO: implement
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
}

export default new OrderApi();