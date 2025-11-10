// Decodificador simple de JWT (no verifica firma)
export function parseJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const result = decodeURIComponent(
      json
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(result) as T;
  } catch {
    return null;
  }
}

export function getJwtExp(token?: string): number | null {
  if (!token) return null;
  const payload = parseJwt<{ exp?: number }>(token);
  return payload?.exp ?? null;
}
