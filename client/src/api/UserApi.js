import AuthApi from './AuthApi';

class UserApi {
  login = user => {
    return fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => {
        if (res.status !== 200) {
          throw new Error('rethink life');
        } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  getAll = () => {
    return fetch('http://localhost:8080/api/user', {
      method: 'GET',
        headers : {
            'Authorization' : 'Bearer ' + AuthApi.getToken()
        }
    })
      .then(res => {
        if(res.status !== 200){
          throw new Error('failed to get users');
         } else {
          return res;
        }

    })
    .then(res => res.json())
  }

  getById = id => {
    return fetch(`http://localhost:8080/api/user/${id}`)
      .then(res => res.json())
  }

  update = user => {
    return fetch('http://localhost:8080/api/user', {
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
          throw new Error('Unautheried access')
    } else {
          return res;
        }
      })
      .then(res => res.json())
  }

  create = user => {
    return fetch('http://localhost:8080/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
  }

  deleteAllCartProducts = id => {
    return fetch(`http://localhost:8080/api/user/${id}/cartProduct`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
  }
}

export default new UserApi();
