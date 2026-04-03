import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';

export { BASE_URL };

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for slow Render cold starts
});

api.interceptors.request.use(
  async (config) => {
    const userJSON = await AsyncStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
