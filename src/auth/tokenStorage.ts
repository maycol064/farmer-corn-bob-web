import type { AuthPayload, Tokens, User } from '../types';

const STORAGE_KEY = 'auth';

type Listener = (data: { user: User | null; tokens: Tokens | null }) => void;

let memory: { user: User | null; tokens: Tokens | null } = load();
const listeners = new Set<Listener>();

function load() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return { user: null, tokens: null };
  try {
    return JSON.parse(raw) as { user: User; tokens: Tokens };
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return { user: null, tokens: null };
  }
}

function persist() {
  if (memory.user && memory.tokens) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } else {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export const tokenStorage = {
  getUser() {
    return memory.user;
  },
  getTokens() {
    return memory.tokens;
  },
  getAccessToken() {
    return memory.tokens?.accessToken ?? null;
  },
  getRefreshToken() {
    return memory.tokens?.refreshToken ?? null;
  },
  getRefreshJti() {
    return memory.tokens?.refreshJti ?? null;
  },

  setAuth(payload: AuthPayload) {
    memory = { user: payload.user, tokens: payload.tokens };
    persist();
    listeners.forEach((l) => l(memory));
  },
  setTokens(tokens: Tokens) {
    memory = { user: memory.user, tokens };
    persist();
    listeners.forEach((l) => l(memory));
  },
  clear() {
    memory = { user: null, tokens: null };
    persist();
    listeners.forEach((l) => l(memory));
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
