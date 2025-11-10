import { useMemo, useState } from 'react';
import { buyCorn } from '../api/corn';
import { useCountdown } from '../hooks/useCountdown';
import { RateLimitInfo } from './RateLimitInfo';
import { mergeRateLimitHeaders } from '../api/headers';

function parseHeaders(headers: Record<string, any>) {
  const get = (k: string) => headers?.[k];
  const toNum = (v: any) => (v == null || v === '' ? undefined : Number(v));
  const limit = toNum(get('x-ratelimit-limit'));
  const remaining = toNum(get('x-ratelimit-remaining'));
  const resetEpoch = toNum(get('x-ratelimit-reset'));
  const retryAfter = toNum(get('retry-after'));
  return { limit, remaining, resetEpoch, retryAfter };
}

export function PurchaseCard() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [emoji, setEmoji] = useState('🌽');

  const [headers, setHeaders] = useState<Record<string, any>>({});
  const parsed = useMemo(() => parseHeaders(headers), [headers]);

  const [lockUntil, setLockUntil] = useState<number | null>(null);

  const initialWait = useMemo(() => {
    if (lockUntil) {
      const nowSec = Math.floor(Date.now() / 1000);
      return Math.max(0, lockUntil - nowSec);
    }
    return 0;
  }, [lockUntil]);

  const countdown = useCountdown(initialWait);

  function computeWaitSecondsFor429(h: Record<string, any>) {
    const { retryAfter, resetEpoch } = parseHeaders(h);
    if (retryAfter && retryAfter > 0) return retryAfter;
    if (resetEpoch && resetEpoch > 0) {
      const nowSec = Math.floor(Date.now() / 1000);
      return Math.max(1, resetEpoch - nowSec);
    }
    return 5;
  }

  async function onBuy() {
    setStatus('idle');
    try {
      const res = await buyCorn();
      if (res.ok) {
        setEmoji(res.emoji);
        setHeaders((prev) => mergeRateLimitHeaders(prev, res.headers || {}));
        setLockUntil(null);
        setStatus('ok');
      } else if ((res as any).status === 429) {
        const plain = (res as any).headers || {};
        setHeaders((prev) => mergeRateLimitHeaders(prev, plain));
        const wait = computeWaitSecondsFor429(plain);
        const nowSec = Math.floor(Date.now() / 1000);
        const desired = nowSec + wait;
        setLockUntil((prev) => (prev && prev > desired ? prev : desired));
      }
    } catch {
      setStatus('err');
    }
  }

  const progress =
    initialWait > 0
      ? Math.round(((initialWait - countdown) / initialWait) * 100)
      : 0;

  const isLocked = countdown > 0;

  return (
    <div className="card max-w-xl">
      <h3 className="text-lg font-semibold">Buy corn</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Rule: Maximum 1 purchase per customer every 60 seconds.
      </p>

      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBuy} className="btn btn-primary text-lg py-1 px-4">
            Buy <span className="pl-5">🌽</span>
          </button>
        </div>
        {status === 'ok' && (
          <div className="rounded-md border border-green-400 bg-green-50 p-1 px-10 text-sm text-green-900 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
            <span className="text-lg">{emoji} Purchase completed</span>
          </div>
        )}
      </div>

      {isLocked && (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Limit reached. You can shop again in <b>{countdown}s</b>.
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-amber-200/60 dark:bg-amber-800/50">
            <div
              className="h-full bg-amber-500 transition-[width] duration-1000 ease-linear dark:bg-amber-400"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            />
          </div>
        </div>
      )}

      {status === 'err' && (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          Error to buy.
        </div>
      )}

      <RateLimitInfo
        h={{
          limit: parsed.limit,
          remaining: parsed.remaining,
          resetEpoch: parsed.resetEpoch,
        }}
      />
    </div>
  );
}
