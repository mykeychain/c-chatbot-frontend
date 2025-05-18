import axios from 'axios';
import { keysToCamel } from './case';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

api.interceptors.response.use(response => {
  response.data = keysToCamel(response.data);
  return response;
});
