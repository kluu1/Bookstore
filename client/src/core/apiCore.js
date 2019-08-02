import { API_URL } from '../config';
import axios from 'axios';

export const getProducts = sortBy => {
  return axios.get(`${API_URL}/products?sortBy=${sortBy}&order=desc&limit=6`);
};
