class ProductApi {
  getAll = () => {
    return fetch('http://localhost:8080/api/product')
      .then(res => res.json())
  }

  create = product => {
    return fetch('http://localhost:8080/api/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
  }

  update = product => {
    return fetch('http://localhost:8080/api/product', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
  }

  delete = id => {
    return fetch(`http://localhost:8080/api/product/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
  }

  addImages = (id, images) => {
    return fetch(`http://localhost:8080/api/product/${id}/images`, {
      method: 'POST',
      body: images
    })
      .then(res => res.json())
  }
}

export default new ProductApi();
