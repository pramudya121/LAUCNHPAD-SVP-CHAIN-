import { createPublicClient, createWalletClient, custom, http, type WalletClient, type Account, getContract } from 'viem'
import { SVP_TESTNET } from '@/lib/contracts/config'
import { launchpadFactoryAbi, bondingCurveAbi, erc20Abi, feeManagerAbi, antiBotManagerAbi, referralSystemAbi, lpLockerAbi } from '@/lib/contracts/abi'
import type { Address } from 'viem'

export const publicClient = createPublicClient({ chain: SVP_TESTNET, transport: http() })

export function getWalletClient(): WalletClient | null {
  if (typeof window === 'undefined' || !(window as Window & { ethereum?: unknown }).ethereum) return null
  return createWalletClient({ chain: SVP_TESTNET, transport: custom((window as unknown as { ethereum: Parameters<typeof custom>[0] }).ethereum) })
}

export async function connectWallet() {
  const wallet = getWalletClient()
  if (!wallet) throw new Error('No EVM wallet detected')
  const [account] = await wallet.requestAddresses()
  return { wallet, account }
}

// Contract Instance Factories
export function getFactoryContract(account?: Account) {
  const { FACTORY } = require('@/lib/contracts/config').CONTRACT_ADDRESSES
  return getContract({
    address: FACTORY,
    abi: launchpadFactoryAbi,
    client: { public: publicClient, wallet: account ? getWalletClient() : undefined }
  })
}

export function getBondingCurveContract(curveAddress: Address, account?: Account) {
  return getContract({
    address: curveAddress,
    abi: bondingCurveAbi,
    client: { public: publicClient, wallet: account ? getWalletClient() : undefined }
  })
}

export function getTokenContract(tokenAddress: Address, account?: Account) {
  return getContract({
    address: tokenAddress,
    abi: erc20Abi,
    client: { public: publicClient, wallet: account ? getWalletClient() : undefined }
  })
}

export function getFeeManagerContract(account?: Account) {
  const { FEE_MANAGER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES
  return getContract({
    address: FEE_MANAGER,
    abi: feeManagerAbi,
    client: { public: publicClient, wallet: account ? getWalletClient() : undefined }
  })
}

export function getAntiBotManagerContract(account?: Account) {
  const { ANTIBOT_MANAGER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES
  return getContract({
    address: ANTIBOT_MANAGER,
    abi: antiBotManagerAbi,
    client: { public: publicClient, wallet: account ? getWalletClient() : undefined }
  })
}

export function getReferralSystemContract(account?: Account) {
  const { REFERRAL_SYSTEM } = require('@/lib/contracts/config').CONTRACT_ADDRESSES
  return getContract({
    address: REFERRAL_SYSTEM,
    abi: referralSystemAbi,
    client: { public: publicClient, wallet: account ? getWalletClient() : undefined }
  })
}

export function getLPLockerContract(account?: Account) {
  const { LP_LOCKER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES
  return getContract({
    address: LP_LOCKER,
    abi: lpLockerAbi,
    client: { public: publicClient, wallet: account ? getWalletClient() : undefined }
  })
}
