import { useEffect, useMemo, useRef, useState } from 'react';
import type { AuthContextType } from './context';
import { AuthContext } from './context';
import type { Tokens, User } from '../types';
import { tokenStorage } from './tokenStorage';
import { getJwtExp } from '../utils/jwt';
import { secondsUntil } from '../utils/time';
import {
  refreshTokens,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from '../api/auth';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(tokenStorage.getUser());
  const [tokens, setTokens] = useState<Tokens | null>(tokenStorage.getTokens());
  const timerRef = useRef<number | null>(null);

  useEffect(
    () =>
      tokenStorage.subscribe(({ user, tokens }) => {
        setUser(user);
        setTokens(tokens);
      }),
    []
  );

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const exp = getJwtExp(tokens?.accessToken || '');
    if (!exp) return;
    const secs = secondsUntil(exp) - 30;
    const ms = Math.max(0, secs * 1000);
    timerRef.current = window.setTimeout(async () => {
      try {
        await refreshTokens();
      } catch {
        /* noop */
      }
    }, ms);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [tokens?.accessToken]);

  const api = useMemo<AuthContextType>(
    () => ({
      user,
      tokens,
      async login(email, password) {
        const payload = await apiLogin({ email, password });
        setUser(payload.user);
        setTokens(payload.tokens);
      },
      async register(email, name, password) {
        await apiRegister({ email, name, password });
        await apiLogin({ email, password });
        setUser(tokenStorage.getUser());
        setTokens(tokenStorage.getTokens());
      },
      async logout() {
        await apiLogout();
        setUser(null);
        setTokens(null);
      },
    }),
    [user, tokens]
  );

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>;
}
