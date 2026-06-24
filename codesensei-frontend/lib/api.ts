import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send httpOnly cookies automatically
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth ─────────────────────────────────────────────────────────────────────
export const registerUser = (email: string, password: string) =>
  api.post('/api/auth/register', { email, password });

export const loginUser = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password });

export const logoutUser = () => api.post('/api/auth/logout');

export const getCurrentUser = () => api.get('/api/auth/me');

// ── Reviews ──────────────────────────────────────────────────────────────────
export const submitReview = (code: string, language: string, review_focus: string) =>
  api.post('/api/review', { code, language, review_focus });

export const getReviewHistory = (limit = 20, offset = 0) =>
  api.get('/api/reviews', { params: { limit, offset } });

export const getReview = (id: number) => api.get(`/api/reviews/${id}`);

export default api;
