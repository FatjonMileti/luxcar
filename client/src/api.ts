import axios from 'axios';

const API_URL: string = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

export interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  engine: string;
  inspected: boolean;
  color: string;
  description: string;
  image: string;
  images: string[];
  featured: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CarInput = Omit<Car, '_id' | 'createdAt' | 'updatedAt'>;

export interface CarListResponse {
  total: number;
  page: number;
  pages: number;
  cars: Car[];
}

export interface FilterOptions {
  brands: string[];
  models: string[];
  years: number[];
  fuels: string[];
  transmissions: string[];
  engines: string[];
  priceRange: { min: number; max: number };
}

export interface Inquiry {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  car: Car | string | null;
  status: string;
}

export interface InquiryInput {
  name: string;
  phone: string;
  email?: string;
  message: string;
  car?: string | null;
}

export type CarQuery = Record<string, string | number | boolean | undefined>;

export async function fetchCars(params: CarQuery = {}): Promise<CarListResponse> {
  const { data } = await api.get<CarListResponse>('/cars', { params });
  return data;
}

export async function fetchCar(id: string): Promise<Car> {
  const { data } = await api.get<Car>(`/cars/${id}`);
  return data;
}

export async function fetchFilters(): Promise<FilterOptions> {
  const { data } = await api.get<FilterOptions>('/cars/filters');
  return data;
}

export async function createCar(payload: CarInput): Promise<Car> {
  const { data } = await api.post<Car>('/cars', payload);
  return data;
}

export async function updateCar(id: string, payload: Partial<CarInput>): Promise<Car> {
  const { data } = await api.put<Car>(`/cars/${id}`, payload);
  return data;
}

export async function deleteCar(id: string): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/cars/${id}`);
  return data;
}

export async function sendInquiry(payload: InquiryInput): Promise<Inquiry> {
  const { data } = await api.post<Inquiry>('/inquiries', payload);
  return data;
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  const { data } = await api.get<Inquiry[]>('/inquiries');
  return data;
}

export const formatPrice = (n: number | string | undefined): string =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Number(n) || 0) + ' €';

export const formatKm = (n: number | string | undefined): string =>
  new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(Number(n) || 0) + ' km';

export default api;
