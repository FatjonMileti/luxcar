import { HttpCache, type CachedResponse } from 'http-cache-lite';
import { config } from './config';

// Tags scope invalidation so admin writes bust exactly the affected listings.
export const CARS_TAG = 'cars';
export const INQUIRIES_TAG = 'inquiries';

export const httpCache = new HttpCache<string, CachedResponse>({
  ttl: config.cacheTtlMs,
  maxSize: 500,
  onError: (err) => console.error('Cache error:', err),
});

export async function invalidateCars(): Promise<void> {
  await httpCache.invalidateByTag(CARS_TAG);
}

export async function invalidateInquiries(): Promise<void> {
  await httpCache.invalidateByTag(INQUIRIES_TAG);
}
