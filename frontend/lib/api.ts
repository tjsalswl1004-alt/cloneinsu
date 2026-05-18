import axios from 'axios';
import type { Claim, ClaimStats, InsuranceCompany, ClaimStatus } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

export const claimService = {
  getAll: (status?: ClaimStatus): Promise<Claim[]> =>
    api.get('/claims', { params: status ? { status } : {} }).then((r) => r.data),

  getById: (id: number): Promise<Claim> =>
    api.get(`/claims/${id}`).then((r) => r.data),

  create: (data: Partial<Claim>): Promise<Claim> =>
    api.post('/claims', data).then((r) => r.data),

  update: (id: number, data: Partial<Claim>): Promise<Claim> =>
    api.put(`/claims/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete(`/claims/${id}`),

  getStats: (): Promise<ClaimStats> =>
    api.get('/claims/stats').then((r) => r.data),
};

export const insuranceCompanyService = {
  getAll: (): Promise<InsuranceCompany[]> =>
    api.get('/insurance-companies').then((r) => r.data),

  getByCategory: (category: string): Promise<InsuranceCompany[]> =>
    api.get('/insurance-companies', { params: { category } }).then((r) => r.data),
};

export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone: string;
  company: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  name: string;
  role: 'UNAUTHENTICATED' | 'AUTHENTICATED' | 'ADMIN';
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  role: 'UNAUTHENTICATED' | 'AUTHENTICATED' | 'ADMIN';
  verified: boolean;
}

export const authService = {
  signup: (data: SignupRequest): Promise<SignupResponse> =>
    api.post('/auth/signup', data).then((r) => r.data),

  login: (data: LoginRequestBody): Promise<LoginResponse> =>
    api.post('/auth/login', data).then((r) => r.data),
};
