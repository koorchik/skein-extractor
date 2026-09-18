/**
 * Runs `work` over `items` with at most `limit` calls in flight and returns the results in input
 * order. After the first error no further item is started; the calls already in flight settle,
 * then the first error is thrown. A caller that wants to survive per-item failures catches them
 * inside `work`.
 */
export async function mapWithConcurrency<T, R>(items: T[], limit: number, work: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  let failure: { error: unknown } | null = null;
  const worker = async () => {
    while (failure === null && next < items.length) {
      const index = next++;
      try {
        results[index] = await work(items[index], index);
      } catch (error) {
        failure ??= { error };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(limit, items.length)) }, worker));
  if (failure !== null) throw (failure as { error: unknown }).error;
  return results;
}
