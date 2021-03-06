import AuthApi from './AuthApi';
import Config from './Config';

class ProductApi {
  getAll = () => {
    return fetch(Config.url + '/product')
      .then(res => res.json())
  }

  getOne = id => {
    return fetch(Config.url + `/product/${id}`)
      .then(res => res.json())
  }

  create = product => {
    return fetch(Config.url +'/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      },
      body: JSON.stringify(product)
    }).then(res => {
      if(res.status === 401){
        throw new Error('Unautherized access')
      }
      else{
        return res;
      }
    })
      .then(res => res.json())
  }

  update = product => {
    return fetch(Config.url + '/product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      },
      body: JSON.stringify(product)
    }).then(res => {
      if(res.status === 401){
        throw new Error('Unautherized access')
      }
      else{
        return res;
      }
    })
      .then(res => {
        switch(res.status) {
          case 409: {
            throw new Error('Another user already updated this product');
          }
          case 200 : {
            return  res;
          }
          default : {
            throw new Error('Something went wrong. Cannot login');
          }
        }
      })
      .then(res => res.json())
  }

  delete = id => {
    return fetch(Config.url + `/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    }).then(res => {
      if(res.status === 401){
        throw new Error('Unautherized access')
      }
      else{
        return res;
      }
    })
      .then(res => res.json())
  }

  addImages = (id, images) => {
    return fetch(Config.url + `/product/${id}/images`, {
      method: 'POST',
      body: images,
      headers:{
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    }).then(res => {
      if(res.status === 401){
        throw new Error('Unautherized access')
      }
      else{
        return res;
      }
    })
      .then(res => res.json())
  }

  addProperties = (id, properties) => {
    return fetch(Config.url + `/product/${id}/properties`, {
      method: 'POST',
      body: properties,
      headers:{
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    }).then(res => {
      if(res.status === 401){
        throw new Error('Unautherized access')
      }
      else{
        return res;
      }
    })
      .then(res => res.json())
  }
}

export default new ProductApi();
