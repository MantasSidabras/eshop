<<<<<<< HEAD
import AuthApi from './AuthApi';
=======
import Config from './Config';
>>>>>>> 66b0791aa33ebe668f161c4ceac47fe707b88cb4

class ProductImageApi {
  get = id => Config.url + `/product-image/${id}`;

  delete = id => {
    return fetch(Config.url + `/product-image/${id}`, {
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
