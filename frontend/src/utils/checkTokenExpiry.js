import { jwtDecode } from 'jwt-decode'; // Correct import statement

const checkTokenExpiry = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      // Token is expired
      localStorage.removeItem('token');
      return false;
    }
  }
  return true;
};

export default checkTokenExpiry;
