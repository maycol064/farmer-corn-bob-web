type RLHeaders = {
  limit?: number;
  remaining?: number;
  resetEpoch?: number;
};

export function RateLimitInfo({ h }: { h: RLHeaders }) {
  const hasAny = h.limit != null || h.remaining != null || h.resetEpoch != null;
  if (!hasAny) return null;

  const resetDate = h.resetEpoch ? new Date(h.resetEpoch * 1000) : null;
  return (
    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
      {h.limit != null && (
        <div>
          Rate limit: <span className="font-medium">{h.limit}</span>
        </div>
      )}
      {h.remaining != null && (
        <div>
          Remaining: <span className="font-medium">{h.remaining}</span>
        </div>
      )}
      {resetDate && <div>Reset: {resetDate.toLocaleTimeString()}</div>}
    </div>
  );
}
