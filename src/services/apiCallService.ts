import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Base Axios Client for KwikCheck
 */
const client = axios.create({
  baseURL: 'https://inspection.kwikcheck.in/', // Hardcoded for now as per analysis
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Version': '2',
  },
});

/* Request Interceptor to add Token */
client.interceptors.request.use(
  async (config) => {
    try {
      const userCreds = await AsyncStorage.getItem('user_credentials');
      if (userCreds) {
        const parsed = JSON.parse(userCreds);
        if (parsed?.TOKENID) {
          config.headers.TokenID = parsed.TOKENID;
        }
      }
    } catch (error) {
      // Ignore token error for now
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response Interceptor */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * API Call Service Wrapper
 * Matches the structure expected by login.api.ts (and future migrations)
 */
const apiCallService = {
  post: async (request: { service: string; body: any; headers?: any }) => {
    try {
      const config = {
        headers: {
          ...request.headers
        }
      };

      const response = await client.post(request.service, request.body, config);
      console.log(`Response from ${request.service}: `, response.data)
      return response.data;
    } catch (error: any) {
      // Return the error response data if available, to let caller handle 'ERROR' fields
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },
};

export default apiCallService;
