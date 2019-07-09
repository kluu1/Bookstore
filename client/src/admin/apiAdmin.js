import { API_URL } from '../config';
import axios from 'axios';

export const createCategory = (userId, token, category) => {
  return axios({
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    url: `${API_URL}/category/createCategory/${userId}`,
    data: JSON.stringify(category)
  });
};
