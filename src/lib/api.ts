import axios from 'axios';
import { keysToCamel, keysToSnake } from './case';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
});

api.interceptors.response.use(response => {
  response.data = keysToCamel(response.data);
  return response;
});

api.interceptors.request.use(config => {
  if (config.data && typeof config.data === 'object') {
    config.data = keysToSnake(config.data);
  }
  if (config.params && typeof config.params === 'object') {
    config.params = keysToSnake(config.params);
  }
  return config;
}, error => Promise.reject(error));
