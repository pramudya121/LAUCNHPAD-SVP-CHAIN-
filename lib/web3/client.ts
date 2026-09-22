import { createPublicClient, createWalletClient, custom, http, type WalletClient, type Account, getContract, getAddress } from 'viem'
import { SVP_TESTNET } from '@/lib/contracts/config'
import { launchpadFactoryAbi, bondingCurveAbi, erc20Abi, feeManagerAbi, antiBotManagerAbi, referralSystemAbi, lpLockerAbi } from '@/lib/contracts/abi'
import type { Address } from 'viem'

export const publicClient = createPublicClient({ chain: SVP_TESTNET, transport: http() })

type WalletState = { address: Address | null; chainId: number | null; isSupportedChain: boolean }
type EthereumProvider = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown>; on?: (event: string, handler: (...args: unknown[]) => void) => void; removeListener?: (event: string, handler: (...args: unknown[]) => void) => void };

const normalizeAddress = (value?: string) => value ? getAddress(value) : null
const parseChainId = (value: unknown) => typeof value === 'string' ? Number.parseInt(value, 16) : Number(value)

function provider() { return typeof window !== 'undefined' ? (window as Window & { ethereum?: EthereumProvider }).ethereum : undefined }

export function getWalletClient(): WalletClient | null { const ethereum = provider(); if (!ethereum) return null; return createWalletClient({ chain: SVP_TESTNET, transport: custom(ethereum) }) }

export async function readWalletState(): Promise<WalletState> { const ethereum = provider(); if (!ethereum) return { address: null, chainId: null, isSupportedChain: false }; const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[]; const chainHex = await ethereum.request({ method: 'eth_chainId' }) as string; const chainId = parseChainId(chainHex); const address = normalizeAddress(accounts[0]); return { address, chainId, isSupportedChain: chainId === SVP_TESTNET.id } }

export function subscribeWallet(onChange: (state: WalletState) => void) { const ethereum = provider(); if (!ethereum?.on) return () => undefined; const refresh = () => { readWalletState().then(onChange).catch(() => onChange({ address: null, chainId: null, isSupportedChain: false })) }; ethereum.on('accountsChanged', refresh); ethereum.on('chainChanged', refresh); return () => { ethereum.removeListener?.('accountsChanged', refresh); ethereum.removeListener?.('chainChanged', refresh) } }

export async function connectWallet() { const wallet = getWalletClient(); if (!wallet) throw new Error('No EVM wallet detected.'); const [account] = await wallet.requestAddresses(); if (!account) throw new Error('Wallet connection was not approved.'); const state = await readWalletState(); const normalized = normalizeAddress(account); if (!state.address || !normalized || state.address.toLowerCase() !== normalized.toLowerCase()) throw new Error('Wallet account changed before connection completed.'); return { wallet, account: normalized, chainId: state.chainId, isSupportedChain: state.isSupportedChain } }

export async function disconnectWallet() { return { address: null, chainId: null, isSupportedChain: false } satisfies WalletState }

export function assertActiveWallet(expected: Address, actual: Address) { if (expected.toLowerCase() !== actual.toLowerCase()) throw new Error('The wallet account changed. Review the active account before continuing.') }

export function getFactoryContract(account?: Account) { const { FACTORY } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: FACTORY, abi: launchpadFactoryAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getBondingCurveContract(curveAddress: Address, account?: Account) { return getContract({ address: curveAddress, abi: bondingCurveAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getTokenContract(tokenAddress: Address, account?: Account) { return getContract({ address: tokenAddress, abi: erc20Abi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getFeeManagerContract(account?: Account) { const { FEE_MANAGER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: FEE_MANAGER, abi: feeManagerAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getAntiBotManagerContract(account?: Account) { const { ANTIBOT_MANAGER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: ANTIBOT_MANAGER, abi: antiBotManagerAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getReferralSystemContract(account?: Account) { const { REFERRAL_SYSTEM } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: REFERRAL_SYSTEM, abi: referralSystemAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
export function getLPLockerContract(account?: Account) { const { LP_LOCKER } = require('@/lib/contracts/config').CONTRACT_ADDRESSES; return getContract({ address: LP_LOCKER, abi: lpLockerAbi, client: { public: publicClient, wallet: account ? (getWalletClient() ?? undefined) : undefined } }) }
