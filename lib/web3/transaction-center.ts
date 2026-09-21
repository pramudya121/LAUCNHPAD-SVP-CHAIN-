import { useCallback, useState } from 'react'
import type { Hash } from 'viem'
import { formatTransactionError, type TransactionStage } from '@/lib/web3/transaction-safety'

export function useTransactionCenter() {
  const [stage, setStage] = useState<TransactionStage>('idle')
  const [hash, setHash] = useState<Hash>()
  const [error, setError] = useState<string>()
  const reset = useCallback(() => { setStage('idle'); setHash(undefined); setError(undefined) }, [])
  const run = useCallback(async (action: () => Promise<Hash>) => {
    setStage('awaiting_wallet'); setError(undefined)
    try {
      const nextHash = await action()
      setHash(nextHash); setStage('submitted'); return nextHash
    } catch (cause) {
      const message = formatTransactionError(cause)
      setError(message); setStage('failed'); throw new Error(message)
    }
  }, [])
  return { stage, hash, error, reset, run, setStage }
}
