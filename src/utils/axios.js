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



export const customAuthApiCall = (url, options = {}, baseURLOverride) => {
  const config = {
    ...options,
    baseURL: baseURLOverride || authApiClient.defaults.baseURL,
    url,
  };
  return authApiClient(config);
};


export const authApiClient = axios.create({
  baseURL: 'https://apyatlas.us.auth0.com/api/v2',
  headers: {
    'Content-Type': 'application/json'
  }
});
authApiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


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
