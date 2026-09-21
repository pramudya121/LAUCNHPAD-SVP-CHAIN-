import type { Address } from 'viem'

// Bonding Curve Data Types
export interface BondingCurveState {
  tokenRaised: bigint
  tokenSupply: bigint
  currentPrice: bigint
  progress: number // 0-100
  graduated: boolean
  totalVolume: bigint
}

export interface TradeData {
  amount: bigint
  price: bigint
  side: 'buy' | 'sell'
  timestamp: number
  transactionHash: string
  trader: Address
}

export interface TokenMetadata {
  address: Address
  name: string
  symbol: string
  decimals: number
  totalSupply: bigint
  logoUrl?: string
  description?: string
  creatorAddress: Address
  createdAt: number
  status: 'bonding' | 'graduated' | 'delisted'
}

export interface PricePoint {
  timestamp: number
  open: bigint
  high: bigint
  low: bigint
  close: bigint
  volume: bigint
}

export interface TokenStats {
  priceUsd: number
  priceChange24h: number
  volume24h: bigint
  marketCap: bigint
  holders: number
  liquidity: bigint
}

export interface HolderInfo {
  address: Address
  balance: bigint
  percentage: number
  lastUpdated: number
}

export interface UserPosition {
  tokenAddress: Address
  balance: bigint
  averageBuyPrice: bigint
  totalInvested: bigint
  currentValue: bigint
  pnl: bigint
  pnlPercent: number
}

export interface CreateTokenParams {
  name: string
  symbol: string
  description: string
  logoUrl?: string
  initialSupply: bigint
  decimals: number
  antiBotEnabled: boolean
  antiBot?: {
    maxBuyPercent: number
    maxSellPercent: number
    cooldownSeconds: number
  }
}

export interface FeeDistribution {
  treasury: bigint
  team: bigint
  marketing: bigint
  holders: bigint
}

export interface ReferralData {
  referrerAddress: Address
  refereeAddress: Address
  feeAmount: bigint
  tokenAddress: Address
  createdAt: number
}

export interface LiquidityLockInfo {
  tokenAddress: Address
  lpTokenAddress: Address
  lockedAmount: bigint
  unlockTime: number
  lockId: string
}
