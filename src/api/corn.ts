import { http } from './http';
import { toPlainHeaders } from './headers';

export async function buyCorn() {
  try {
    const res = await http.post('/corn/purchase');
    return {
      ok: true as const,
      emoji: (res.data ?? '🌽') as string,
      headers: toPlainHeaders(res.headers),
    };
  } catch (err: any) {
    const res = err.response;
    if (res?.status === 429) {
      return {
        ok: false as const,
        status: 429 as const,
        body: res.data,
        headers: toPlainHeaders(res.headers),
      };
    }
    throw err;
  }
}
