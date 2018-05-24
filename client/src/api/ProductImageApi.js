import AuthApi from './AuthApi';

class ProductImageApi {
  get = id => `http://localhost:8080/api/product-image/${id}`;

  delete = id => {
    return fetch(`http://localhost:8080/api/product-image/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    })
    .then(res => {
      if (res.status === 400) {
        throw new Error('Bad request')
      } else if(res.status === 401){
        throw new Error('Unautherized access')
    } else {
        return res;
      }
    }).then(res => res.json())
  }
}

export default new ProductImageApi();