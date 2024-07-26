import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  // timeout: 1000,
  // headers: { 'Content-Type': 'application/json' },
});

// Set up interceptors here if needed
// api.interceptors.request.use(request => {
//   // Modify request config here
//   return request;
// });

// api.interceptors.response.use(response => {
//   // Handle response data here
//   return response;
// });

export { api };
