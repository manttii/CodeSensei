import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const TOKEN_KEY = 'codesensei_token';

export const getToken = (): string | null =>
  typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
};

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (email: string, password: string) =>
  api.post('/api/auth/register', { email, password });

export const loginUser = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password });

export const logoutUser = () => {
  clearToken();
  return api.post('/api/auth/logout');
};

export const getCurrentUser = () => api.get('/api/auth/me');

// ── Reviews ──────────────────────────────────────────────────────────────────
export const submitReview = (code: string, language: string, review_focus: string) =>
  api.post('/api/review', { code, language, review_focus });

export const getReviewHistory = (limit = 20, offset = 0) =>
  api.get('/api/reviews', { params: { limit, offset } });

export const getReview = (id: number) => api.get(`/api/reviews/${id}`);

export default api;
