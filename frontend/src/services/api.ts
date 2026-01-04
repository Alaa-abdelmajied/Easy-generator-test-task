import axios from 'axios';
import { AuthResponse, SignUpData, SignInData, User } from '../types/auth';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const authService = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signin', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export default api;

