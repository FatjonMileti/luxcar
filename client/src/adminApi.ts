import axios from 'axios';
import type { Car, CarInput, CarListResponse } from './api';

// Base URL of the FastAPI admin service (configured via environment variables).
export const ADMIN_API_URL: string =
  import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:8000';

const TOKEN_KEY = 'luxcar_admin_token';

const adminApi = axios.create({ baseURL: ADMIN_API_URL });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export interface AdminMe {
  _id: string;
  email: string;
}

export interface AdminStats {
  totalCars: number;
  inStock: number;
  inTransit: number;
  sold: number;
  featured: number;
  totalInquiries: number;
  newInquiries: number;
  totalStockValue: number;
}

export interface AdminInquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  car: string | null;
  carLabel: string | null;
  status: 'New' | 'Read' | 'Closed';
}

export async function adminLogin(email: string, password: string): Promise<string> {
  const { data } = await adminApi.post<{ access_token: string }>('/auth/login', {
    email,
    password,
  });
  setAdminToken(data.access_token);
  return data.access_token;
}

export async function adminMe(): Promise<AdminMe> {
  const { data } = await adminApi.get<AdminMe>('/auth/me');
  return data;
}

export function adminLogout(): void {
  clearAdminToken();
}

export async function fetchAdminCars(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<CarListResponse> {
  const { data } = await adminApi.get<CarListResponse>('/admin/cars', { params });
  return data;
}

export async function createAdminCar(payload: CarInput): Promise<Car> {
  const { data } = await adminApi.post<Car>('/admin/cars', payload);
  return data;
}

export async function updateAdminCar(id: string, payload: Partial<CarInput>): Promise<Car> {
  const { data } = await adminApi.put<Car>(`/admin/cars/${id}`, payload);
  return data;
}

export async function deleteAdminCar(id: string): Promise<void> {
  await adminApi.delete(`/admin/cars/${id}`);
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await adminApi.get<AdminStats>('/admin/stats');
  return data;
}

export async function fetchAdminInquiries(status?: string): Promise<AdminInquiry[]> {
  const { data } = await adminApi.get<AdminInquiry[]>('/admin/inquiries', {
    params: status ? { status } : {},
  });
  return data;
}

export async function updateInquiryStatus(
  id: string,
  status: AdminInquiry['status']
): Promise<AdminInquiry> {
  const { data } = await adminApi.patch<AdminInquiry>(`/admin/inquiries/${id}`, { status });
  return data;
}

export async function deleteAdminInquiry(id: string): Promise<void> {
  await adminApi.delete(`/admin/inquiries/${id}`);
}

export function adminApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = (err.response?.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === 'string') return detail;
    if (err.response?.status === 401) return 'Not authenticated. Please log in again.';
    return err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong';
}

export default adminApi;
