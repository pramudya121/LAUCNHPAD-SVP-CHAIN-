export type DataSource = 'on-chain' | 'indexed' | 'combined'

export type DataFreshness = {
  source: DataSource
  indexedAt?: string | null
  blockNumber?: number | null
  isStale: boolean
  lagSeconds?: number | null
}

export type QueryState<T> = {
  data: T | null
  isLoading: boolean
  error: string | null
  freshness?: DataFreshness
}

export function getFreshness(indexedAt?: string | null, maxAgeSeconds = 120): DataFreshness {
  const age = indexedAt ? Math.max(0, Math.floor((Date.now() - new Date(indexedAt).getTime()) / 1000)) : null
  return { source: 'indexed', indexedAt, isStale: age === null || age > maxAgeSeconds, lagSeconds: age }
}

export function normalizeAddress(address?: string | null) {
  return address?.trim().toLowerCase() || null
}

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase().slice(0, 120)
}
