import { auth } from './firebaseClient';

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;
  
  const headers = new Headers(fetchOptions.headers);
  headers.set('Content-Type', 'application/json');

  if (requiresAuth) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be signed in to perform this action.');
    }
    const token = await user.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'An unexpected error occurred.') as ApiError;
    error.status = response.status;
    error.code = data.code;
    error.details = data.details;
    throw error;
  }

  return data as T;
}
