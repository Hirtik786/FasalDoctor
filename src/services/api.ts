export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data: T;
  fromBackend: boolean;
}

/**
 * Centralized HTTP client prepared for FastAPI backend integration.
 * Services call this helper first when attempting live API requests,
 * and gracefully fall back to clearly labeled local mock data when offline.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 2500
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    await apiRequest<{ status: string }>('/health', { method: 'GET' }, 1200);
    return true;
  } catch {
    return false;
  }
}
