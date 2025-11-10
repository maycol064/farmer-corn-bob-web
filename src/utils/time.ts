export const nowEpochSec = () => Math.floor(Date.now() / 1000);

export function secondsUntil(epochSec: number): number {
  return Math.max(0, epochSec - nowEpochSec());
}
