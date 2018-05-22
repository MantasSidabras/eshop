import Config from './Config';

class ProductImageApi {
  get = id => Config.url + `/product-image/${id}`;

  delete = id => {
    return fetch(Config.url + `/product-image/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
  }
}

export default new ProductImageApi();
