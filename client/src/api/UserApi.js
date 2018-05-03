class UserApi {
  getAll = () => {
    return fetch('http://localhost:8080/api/user')
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
}

export default new UserApi();