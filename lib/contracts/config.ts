import type { Address } from 'viem'

export const SVP_TESTNET = {
  id: Number(process.env.NEXT_PUBLIC_SVP_CHAIN_ID ?? 551),
  name: 'SVP Chain Testnet',
  nativeCurrency: { name: 'SVP', symbol: 'SVP', decimals: 18 },
  rpcUrls: { default: { http: [process.env.NEXT_PUBLIC_SVP_RPC_URL ?? 'https://testnet-rpc.svpchain.io'] } },
} as const

export const CONTRACT_ADDRESSES = {
  FACTORY: (process.env.NEXT_PUBLIC_FACTORY_ADDRESS ?? '') as Address,
  FEE_MANAGER: '0x55a1F05ed52147584C6C428cE5c5376a0f195bD5' as Address,
  ANTIBOT_MANAGER: (process.env.NEXT_PUBLIC_ANTIBOT_ADDRESS ?? '') as Address,
  REFERRAL_SYSTEM: (process.env.NEXT_PUBLIC_REFERRAL_ADDRESS ?? '') as Address,
  LP_LOCKER: (process.env.NEXT_PUBLIC_LP_LOCKER_ADDRESS ?? '') as Address,
  ROUTER: (process.env.NEXT_PUBLIC_ROUTER_ADDRESS ?? '') as Address,
}

export const EXPLORER_URL = process.env.NEXT_PUBLIC_SVP_EXPLORER_URL ?? 'https://explorer.svpchain.io'
export const CREATION_FEE = process.env.NEXT_PUBLIC_CREATION_FEE ?? '0.5'
export const isConfiguredAddress = (address: string) => /^0x[0-9a-fA-F]{40}$/.test(address)
export const explorerAddress = (address: string) => `${EXPLORER_URL}/address/${address}`
export const explorerTx = (hash: string) => `${EXPLORER_URL}/tx/${hash}`

export type TokenStatus = 'bonding' | 'graduated' | 'delisted'
export type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'

export function shortenAddress(address?: string, chars = 4) {
  if (!address) return '—'
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

export function formatUnitsSafe(value: bigint | undefined, decimals = 18) {
  if (value === undefined) return '—'
  const whole = value / BigInt(10) ** BigInt(decimals)
  return whole.toLocaleString()
}

export const feeManagerCapabilities = ['distributeETH', 'distributeToken', 'receiveToken', 'emergencyWithdrawETH', 'emergencyWithdrawToken', 'pause'] as const
