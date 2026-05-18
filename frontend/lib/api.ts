import type { Claim, ClaimStats, InsuranceCompany, ClaimStatus } from '@/types';

const BASE = '/api';

export class ApiError extends Error {
  readonly status: number;
  readonly payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  const text = await response.text();
  const payload = text.length > 0 ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : undefined) ?? response.statusText;
    throw new ApiError(response.status, message, payload);
  }

  return payload as T;
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const claimService = {
  getAll: (status?: ClaimStatus): Promise<Claim[]> =>
    request<Claim[]>(status ? `/claims?status=${encodeURIComponent(status)}` : '/claims'),

  getById: (id: number): Promise<Claim> =>
    request<Claim>(`/claims/${id}`),

  create: (data: Partial<Claim>): Promise<Claim> =>
    request<Claim>('/claims', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: Partial<Claim>): Promise<Claim> =>
    request<Claim>(`/claims/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  remove: (id: number): Promise<void> =>
    request<void>(`/claims/${id}`, { method: 'DELETE' }),

  getStats: (): Promise<ClaimStats> =>
    request<ClaimStats>('/claims/stats'),
};

export const insuranceCompanyService = {
  getAll: (): Promise<InsuranceCompany[]> =>
    request<InsuranceCompany[]>('/insurance-companies'),

  getByCategory: (category: string): Promise<InsuranceCompany[]> =>
    request<InsuranceCompany[]>(`/insurance-companies?category=${encodeURIComponent(category)}`),
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
    request<SignupResponse>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: LoginRequestBody): Promise<LoginResponse> =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
};
