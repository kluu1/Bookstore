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
