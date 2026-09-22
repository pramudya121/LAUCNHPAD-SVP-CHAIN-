'use client'

import { useEffect, useState } from 'react'
import type { Address } from 'viem'
import { getWalletClient, readWalletState, subscribeWallet } from '@/lib/web3/client'

export function useWalletIdentity() {
  const [address, setAddress] = useState<Address | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'wrong-network' | 'disconnected' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    readWalletState().then((state) => {
      if (!mounted) return
      setAddress(state.address)
      setChainId(state.chainId)
      setError(null)
      setStatus(state.address ? state.isSupportedChain ? 'connected' : 'wrong-network' : 'disconnected')
    }).catch((cause) => {
      if (!mounted) return
      setAddress(null)
      setChainId(null)
      setError(cause instanceof Error ? cause.message : 'Unable to read wallet state.')
      setStatus('error')
    })
    const unsubscribe = subscribeWallet((state) => {
      if (!mounted) return
      setAddress(state.address)
      setChainId(state.chainId)
      setError(null)
      setStatus(state.address ? state.isSupportedChain ? 'connected' : 'wrong-network' : 'disconnected')
    })
    return () => { mounted = false; unsubscribe() }
  }, [])

  async function connect() {
    setStatus('connecting')
    setError(null)
    try {
      const wallet = getWalletClient()
      if (!wallet) throw new Error('No EVM wallet detected.')
      const state = await readWalletState()
      if (!state.address) throw new Error('Wallet connection was not approved.')
      setAddress(state.address)
      setChainId(state.chainId)
      setStatus(state.isSupportedChain ? 'connected' : 'wrong-network')
      return { address: state.address, chainId: state.chainId }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Wallet connection failed.'
      setError(message)
      setStatus('error')
      throw cause
    }
  }

  return { address, chainId, status, error, connect }
} 

export function walletAddressLabel(address: Address | null) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Connect wallet'
} 
