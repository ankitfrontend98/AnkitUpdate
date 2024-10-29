import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken = '';
export function setAuthToken(token) {
  authToken = token;
}
// apiClient.interceptors.request.use(
//   (config) => {
//     if (authToken) {
//       config.headers.Authorization = `Bearer ${authToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default apiClient;
