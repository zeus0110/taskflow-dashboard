import axios from 'axios';

const API = axios.create({
  baseURL: 'https://taskflow-api-1sjz.onrender.com',
});

export default API;