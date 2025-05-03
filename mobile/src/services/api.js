
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://10.0.2.2:5000', // Android emulator points to localhost
  // Use this URL for iOS simulator: 'http://localhost:5000'
  // Use your computer's IP for a real device: 'http://192.168.1.X:5000'
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // Set timeout to 10 seconds
});

// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the token from AsyncStorage
      const token = await AsyncStorage.getItem('foodmyway_token');
      
      // If token exists, add it to the headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
