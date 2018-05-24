import AuthApi from './AuthApi';
import Config from './Config';

class UserApi {
  login = user => {
    return fetch(Config.url + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => {
        switch(res.status) {
          case 401 : {
            throw new Error('Incorrect username or password');
          }
          case 403 : {
            throw new Error('User is blocked');
          }
          case 404 : {
            throw new Error('User was not found');
          }
          case 200 : {
            return  res;
          }
          default : {
            throw new Error('Something went wrong. Cannot login');
          }
        }


        if (res.status !== 200) {
          throw new Error('rethink life');
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  getAll = () => {
    return fetch(Config.url +'/user', {
      method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + AuthApi.getToken()
        }
    })
    .then(res => {
      if(res.status !== 200){
        throw new Error('Failed to get users');
        } else {
        return res;
      }
    })
    .then(res => res.json())
  }

  getById = id => {
    return fetch(Config.url + `/user/${id}`, {
        method: 'GET',
        headers: {
            'Authorization' : 'Bearer ' + AuthApi.getToken()
        }
    })
    .then(res => {
      if(res.status !== 200){
        throw new Error('Failed to get user');
      } else {
        return res;
    }
    })
    .then(res => res.json())
  }

  update = user => {
    return fetch(Config.url + '/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      },
      body: JSON.stringify(user)
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

  create = user => {
    return fetch(Config.url +'/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
  }

  deleteAllCartProducts = id => {
    return fetch(Config.url + `/user/${id}/cartProduct`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    })
      .then(res => {
        if(res.status === 401){
          throw new Error('Unautherized cart delete access')
        }else{
          return res;
        }
      }).then(res => res.json())
  }

  checkCartIntegrity = id => {
    return fetch(`http://localhost:8080/api/user/${id}/cart`, {
      method: 'GET',
      headers: {
          'Authorization' : 'Bearer ' + AuthApi.getToken()
      }
    })
      .then(async res => {
        if (res.status === 409) {
          const err = await res.json();
          throw err;
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }
}

export default new UserApi();
