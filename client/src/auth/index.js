import { API_URL } from '../config';
import axios from 'axios';

export const signup = user => {
  return axios({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    url: `${API_URL}/signup`,
    data: JSON.stringify(user)
  });
};

export const login = user => {
  return axios({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    url: `${API_URL}/login`,
    data: JSON.stringify(user)
  });
};

export const authenticate = (data, next) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data));
    next();
  }
};

export const signout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
    next();
    return axios({ method: 'GET', url: `${API_URL}/signout` });
  }
};
