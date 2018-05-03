class ProductImageApi {
  get = id => `http://localhost:8080/api/product-image/${id}`;

  delete = id => {
    return fetch(`http://localhost:8080/api/product-image/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
  }
}

export default new ProductImageApi();