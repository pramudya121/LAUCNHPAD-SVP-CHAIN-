import { publicClient } from '@/lib/web3/client'

export type RpcHealth = { ok: boolean; latencyMs: number | null; blockNumber: bigint | null; checkedAt: string; error?: string }

export async function checkRpcHealth(): Promise<RpcHealth> {
  const started = performance.now()
  try {
    const blockNumber = await publicClient.getBlockNumber()
    return { ok: true, latencyMs: Math.round(performance.now() - started), blockNumber, checkedAt: new Date().toISOString() }
  } catch (error) {
    return { ok: false, latencyMs: Math.round(performance.now() - started), blockNumber: null, checkedAt: new Date().toISOString(), error: error instanceof Error ? error.message : 'RPC unavailable' }
  }
}
