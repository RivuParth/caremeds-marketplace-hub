
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'http://10.0.2.2:5000', // Android emulator points to localhost
  // Use this URL for iOS simulator: 'http://localhost:5000'
  // Use your computer's IP for a real device: 'http://192.168.1.X:5000'
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
