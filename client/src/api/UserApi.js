class UserApi {
  
  getAll = () => {
    return fetch('http://localhost:8080/api/user')
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
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
