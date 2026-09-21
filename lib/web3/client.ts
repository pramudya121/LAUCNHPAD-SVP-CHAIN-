import { createPublicClient, createWalletClient, custom, http, type WalletClient } from 'viem'
import { SVP_TESTNET } from '@/lib/contracts/config'

export const publicClient = createPublicClient({ chain: SVP_TESTNET, transport: http() })

export function getWalletClient(): WalletClient | null {
  if (typeof window === 'undefined' || !(window as Window & { ethereum?: unknown }).ethereum) return null
  return createWalletClient({ chain: SVP_TESTNET, transport: custom((window as Window & { ethereum: any }).ethereum) })
}

export async function connectWallet() {
  const wallet = getWalletClient()
  if (!wallet) throw new Error('No EVM wallet detected')
  const [account] = await wallet.requestAddresses()
  return { wallet, account }
}
