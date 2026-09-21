'use client'

import { useEffect, useState } from 'react'
import type { Address } from 'viem'
import { getWalletClient, readWalletState, subscribeWallet } from '@/lib/web3/client'

export function useWalletIdentity() {
  const [address, setAddress] = useState<Address | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'wrong-network' | 'disconnected'>('idle')

  useEffect(() => {
    let mounted = true
    readWalletState().then((state) => {
      if (!mounted) return
      setAddress(state.address)
      setChainId(state.chainId)
      setStatus(state.address ? state.isSupportedChain ? 'connected' : 'wrong-network' : 'disconnected')
    })
    const unsubscribe = subscribeWallet((state) => {
      if (!mounted) return
      setAddress(state.address)
      setChainId(state.chainId)
      setStatus(state.address ? state.isSupportedChain ? 'connected' : 'wrong-network' : 'disconnected')
    })
    return () => { mounted = false; unsubscribe() }
  }, [])

  async function connect() {
    setStatus('connecting')
    const wallet = getWalletClient()
    if (!wallet) { setStatus('disconnected'); throw new Error('No EVM wallet detected.') }
    const [nextAddress] = await wallet.requestAddresses()
    const nextChainId = await wallet.getChainId()
    setAddress(nextAddress)
    setChainId(nextChainId)
    setStatus(nextChainId === 8888 ? 'connected' : 'wrong-network')
    return { address: nextAddress, chainId: nextChainId }
  }

  return { address, chainId, status, connect }
} 

export function walletAddressLabel(address: Address | null) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'Connect wallet'
} 
