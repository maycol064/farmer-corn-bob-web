import { rawHttp } from './http';
import { tokenStorage } from '../auth/tokenStorage';
import type { AuthPayload } from '../types';

export async function register(input: {
  email: string;
  name: string;
  password: string;
}) {
  const { data } = await rawHttp.post('/auth/register', input, {
    _authless: true,
  } as any);
  return data as { id: string; email: string; name: string };
}

export async function login(input: { email: string; password: string }) {
  const { data } = await rawHttp.post('/auth/login', input, {
    _authless: true,
  } as any);
  const payload = data as AuthPayload;
  tokenStorage.setAuth(payload);
  return payload;
}

export async function refreshTokens() {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const { data } = await rawHttp.post('/auth/refresh', { refreshToken }, {
    _authless: true,
  } as any);
  const current = tokenStorage.getUser();
  if (!current) throw new Error('No user in session');
  tokenStorage.setTokens(data);
  return data as {
    accessToken: string;
    refreshToken: string;
    refreshJti: string;
  };
}

export async function logout() {
  const jti = tokenStorage.getRefreshJti();
  try {
    if (jti) {
      await rawHttp.post('/auth/logout', { jti }, { _authless: true } as any);
    }
  } finally {
    tokenStorage.clear();
  }
}
