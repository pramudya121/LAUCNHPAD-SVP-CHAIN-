import { createPublicClient, createWalletClient, custom, http, type WalletClient, type Account, getContract } from 'viem'
import { SVP_TESTNET } from '@/lib/contracts/config'
import { launchpadFactoryAbi, bondingCurveAbi, erc20Abi, feeManagerAbi, antiBotManagerAbi, referralSystemAbi, lpLockerAbi } from '@/lib/contracts/abi'
import type { Address } from 'viem'

export const publicClient = createPublicClient({ chain: SVP_TESTNET, transport: http() })

type WalletState = { address: Address | null; chainId: number | null; isSupportedChain: boolean }
type EthereumProvider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; on?: (event: string, handler: (...args: unknown[]) => void) => void; removeListener?: (event: string, handler: (...args: unknown[]) => void) => void }

function provider() { return typeof window !== 'undefined' ? (window as Window & { ethereum?: EthereumProvider }).ethereum : undefined }

export function getWalletClient(): WalletClient | null { const ethereum = provider(); if (!ethereum) return null; return createWalletClient({ chain: SVP_TESTNET, transport: custom(ethereum) }) }

export async function readWalletState(): Promise<WalletState> { const ethereum = provider(); if (!ethereum) return { address: null, chainId: null, isSupportedChain: false }; const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[]; const chainHex = await ethereum.request({ method: 'eth_chainId' }) as string; const chainId = Number.parseInt(chainHex, 16); const address = accounts[0] as Address | undefined; return { address: address ?? null, chainId, isSupportedChain: chainId === SVP_TESTNET.id } }

export function subscribeWallet(onChange: (state: WalletState) => void) { const ethereum = provider(); if (!ethereum?.on) return () => undefined; const refresh = () => { readWalletState().then(onChange).catch(() => onChange({ address: null, chainId: null, isSupportedChain: false })) }; ethereum.on('accountsChanged', refresh); ethereum.on('chainChanged', refresh); return () => { ethereum.removeListener?.('accountsChanged', refresh); ethereum.removeListener?.('chainChanged', refresh) } }

export async function connectWallet() { const wallet = getWalletClient(); if (!wallet) throw new Error('No EVM wallet detected'); const [account] = await wallet.requestAddresses(); const chainId = await wallet.getChainId(); return { wallet, account, chainId } }

export function getFactoryContract(account?: Account) { const { FACTORY } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: FACTORY, abi: launchpadFactoryAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getBondingCurveContract(curveAddress: Address, account?: Account) { return getContract({ address: curveAddress, abi: bondingCurveAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getTokenContract(tokenAddress: Address, account?: Account) { return getContract({ address: tokenAddress, abi: erc20Abi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getFeeManagerContract(account?: Account) { const { FEE_MANAGER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: FEE_MANAGER, abi: feeManagerAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getAntiBotManagerContract(account?: Account) { const { ANTIBOT_MANAGER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: ANTIBOT_MANAGER, abi: antiBotManagerAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getReferralSystemContract(account?: Account) { const { REFERRAL_SYSTEM } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: REFERRAL_SYSTEM, abi: referralSystemAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getLPLockerContract(account?: Account) { const { LP_LOCKER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: LP_LOCKER, abi: lpLockerAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
