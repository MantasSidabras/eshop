import jwtDecode from 'jwt-decode';

class AuthApi {
  setToken = token => localStorage.setItem('jwt', token);
  removeToken = () => localStorage.removeItem('jwt');
  getToken = () => localStorage.getItem('jwt');

  isTokenValid = () => {
    const token = this.getDecodedToken();
    if (!token) return false;

    return token.exp > (Date.now() / 1000) ? true : false;
  }

  getDecodedToken = () => {
    let token;
    try {
      token = jwtDecode(this.getToken());
      return token;
    } catch (err) {
      return null;
    }
  }
}

export default new AuthApi();
