'use client'

import useSWR from 'swr'
import { formatUnits, type Address } from 'viem'
import { bondingCurveAbi } from '@/lib/contracts/abi'
import { publicClient } from '@/lib/web3/client'

export function useBondingCurve(address?: Address) {
  const { data, error, mutate } = useSWR(address ? ['bonding-curve', address] : null, async () => {
    const [price, progress, graduated] = await Promise.all([
      publicClient.readContract({ address: address!, abi: bondingCurveAbi, functionName: 'getPrice' }),
      publicClient.readContract({ address: address!, abi: bondingCurveAbi, functionName: 'getProgress' }),
      publicClient.readContract({ address: address!, abi: bondingCurveAbi, functionName: 'graduated' }),
    ])
    return { price: formatUnits(price, 18), progress: Number(progress), graduated }
  }, { refreshInterval: 15_000 })
  return { data, error, refresh: mutate, loading: !data && !error }
}
