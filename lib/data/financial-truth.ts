export type DataState = 'on-chain' | 'indexed' | 'combined' | 'stale' | 'pending' | 'unavailable'

export type FinancialTruth<T> = {
  value: T | null
  state: DataState
  source: 'chain' | 'indexer' | 'chain+indexer' | 'none'
  observedAt: string | null
  blockNumber: bigint | null
  confidence: 'high' | 'medium' | 'low' | 'none'
}

export function unavailable<T>(): FinancialTruth<T> {
  return { value: null, state: 'unavailable', source: 'none', observedAt: null, blockNumber: null, confidence: 'none' }
}

export function reconcile<T>(chainValue: T | null, indexedValue: T | null, observedAt: string | null, blockNumber: bigint | null): FinancialTruth<T> {
  if (chainValue !== null && indexedValue !== null) {
    return { value: chainValue, state: 'combined', source: 'chain+indexer', observedAt, blockNumber, confidence: Object.is(chainValue, indexedValue) ? 'high' : 'medium' }
  }
  if (chainValue !== null) return { value: chainValue, state: 'on-chain', source: 'chain', observedAt, blockNumber, confidence: 'high' }
  if (indexedValue !== null) return { value: indexedValue, state: 'indexed', source: 'indexer', observedAt, blockNumber, confidence: 'medium' }
  return unavailable<T>()
}

export function isStale(observedAt: string | null, maxAgeMs: number): boolean {
  return !observedAt || Date.now() - new Date(observedAt).getTime() > maxAgeMs
}

export function markStale<T>(truth: FinancialTruth<T>): FinancialTruth<T> {
  return truth.value === null ? truth : { ...truth, state: 'stale', confidence: truth.confidence === 'high' ? 'medium' : 'low' }
}

export function formatTruthLabel(truth: FinancialTruth<unknown>): string {
  if (truth.state === 'unavailable') return 'Unavailable'
  if (truth.state === 'stale') return 'Stale data'
  return truth.source === 'chain+indexer' ? 'Chain + indexed' : truth.source === 'chain' ? 'On-chain' : 'Indexed'
} 
