import axios from 'axios';
import apis from "./api-resorces.json";


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

apiClient.interceptors.request.use(
  (config) => {
    //TODO: to be removed
    let attachToken = true;
    if (config.url in apis.resources) {
      const { baseUrl, url } = extractBaseURL(apis.resources[config.url]);
      attachToken =  apis.baseURL[baseUrl] === apis.baseURL.ADMIN_BASE_URL?false:true;
      config.baseURL = apis.baseURL[baseUrl];
      const routeParams = config.routeParams || {};
      config.url = injectRouteParams(url, routeParams);
    }
    if (config.queryParams) {
      const query = new URLSearchParams(config.queryParams).toString();
      config.url += (config.url.includes('?') ? '&' : '?') + query;
    }
    if (authToken && attachToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

function extractBaseURL(input) {
  const match = input.match(/\{([^}]*)\}/);
  if (match && match.index !== undefined) {
    const baseUrl = match[1];
    const url = input.slice(match.index + match[0].length);
    return {
      baseUrl,
      url
    };
  }
  return {
    baseUrl: null,
    url: input
  };
}

function injectRouteParams(url, routeParams = {}) {
  return url.replace(/\{([^}]+)\}/g, (_, key) => {
    return routeParams[key] || `{${key}}`;
  });
}


export default apiClient;
