import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../auth/tokenStorage';
import { getJwtExp } from '../utils/jwt';
import { secondsUntil } from '../utils/time';
import { refreshTokens } from './auth';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({ baseURL, timeout: 15000 });
export const rawHttp = axios.create({ baseURL, timeout: 15000 });

// Config interna extendida
type InternalConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _authless?: boolean;
};

// REQUEST interceptor (síncrono)
http.interceptors.request.use((config: InternalConfig) => {
  if (config._authless) return config;

  const access = tokenStorage.getAccessToken();
  if (access) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${access}`;
  }
  return config;
});

let refreshing: Promise<void> | null = null;

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const response = error.response;
    const original = error.config as InternalConfig;

    const isAuthEndpoint = (original?.url || '').includes('/auth/');
    const unauthorized = response?.status === 401;

    if (!unauthorized || isAuthEndpoint || original?._retry) {
      throw error;
    }

    original._retry = true;

    if (!refreshing) {
      refreshing = (async () => {
        const access = tokenStorage.getAccessToken();
        const exp = getJwtExp(access || '');
        if (!exp || secondsUntil(exp) < 60) {
          await refreshTokens();
        }
      })().finally(() => {
        refreshing = null;
      });
    }

    await refreshing;

    const newAccess = tokenStorage.getAccessToken();
    if (newAccess) {
      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${newAccess}`;
      return http(original as any);
    }

    throw error;
  }
);
