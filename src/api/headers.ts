export function toPlainHeaders(headers: any): Record<string, string> {
  if (!headers) return {};
  const h = headers as any;

  if (typeof h.toJSON === 'function') {
    const json = h.toJSON() as Record<string, string | string[]>;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(json)) {
      out[k.toLowerCase()] = Array.isArray(v) ? v.join(', ') : String(v);
    }
    return out;
  }

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(h)) {
    out[k.toLowerCase()] = String(v as any);
  }
  return out;
}

export function hasRateLimitHeaders(h: Record<string, any>) {
  const keys = [
    'x-ratelimit-limit',
    'x-ratelimit-remaining',
    'x-ratelimit-reset',
    'retry-after',
  ];
  return keys.some((k) => h?.[k] != null && h[k] !== '');
}

export function mergeRateLimitHeaders(
  prev: Record<string, any>,
  next: Record<string, any>
) {
  return hasRateLimitHeaders(next) ? next : prev;
}
