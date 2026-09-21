import type { Abi } from 'viem'

// LaunchpadFactory: Token creation & management
export const launchpadFactoryAbi = [
  // Token Creation
  { type: 'function', name: 'createToken', stateMutability: 'payable', inputs: [
    { name: 'name', type: 'string' },
    { name: 'symbol', type: 'string' },
    { name: 'totalSupply', type: 'uint256' },
    { name: 'decimals', type: 'uint8' },
    { name: 'description', type: 'string' },
    { name: 'logoUrl', type: 'string' },
  ], outputs: [
    { name: 'token', type: 'address' },
    { name: 'curve', type: 'address' }
  ] },
  // Token Queries
  { type: 'function', name: 'getTokens', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'address[]' }] },
  { type: 'function', name: 'getTokensByCreator', stateMutability: 'view', inputs: [{ name: 'creator', type: 'address' }], outputs: [{ name: '', type: 'address[]' }] },
  { type: 'function', name: 'getTokenCount', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'isToken', stateMutability: 'view', inputs: [{ name: 'token', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
  // Fee Management
  { type: 'function', name: 'creationFee', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'setCreationFee', stateMutability: 'nonpayable', inputs: [{ name: 'newFee', type: 'uint256' }], outputs: [] },
  // Events
  { type: 'event', name: 'TokenCreated', inputs: [
    { indexed: true, name: 'token', type: 'address' },
    { indexed: true, name: 'curve', type: 'address' },
    { indexed: true, name: 'creator', type: 'address' },
    { indexed: false, name: 'name', type: 'string' },
    { indexed: false, name: 'symbol', type: 'string' },
  ], anonymous: false },
  { type: 'event', name: 'FeeUpdated', inputs: [{ indexed: false, name: 'newFee', type: 'uint256' }], anonymous: false },
] as const satisfies Abi

// BondingCurve: Token trading (buy/sell)
export const bondingCurveAbi = [
  // Trading Functions
  { type: 'function', name: 'buy', stateMutability: 'payable', inputs: [
    { name: 'minTokensOut', type: 'uint256' },
    { name: 'referrer', type: 'address' }
  ], outputs: [{ name: 'tokensOut', type: 'uint256' }] },
  { type: 'function', name: 'sell', stateMutability: 'nonpayable', inputs: [
    { name: 'tokenAmount', type: 'uint256' },
    { name: 'minEthOut', type: 'uint256' }
  ], outputs: [{ name: 'ethOut', type: 'uint256' }] },
  // Price & Progress Queries
  { type: 'function', name: 'getPrice', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'getPriceForAmount', stateMutability: 'view', inputs: [{ name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'getProgress', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'graduated', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'bool' }] },
  // State Queries
  { type: 'function', name: 'token', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'address' }] },
  { type: 'function', name: 'creator', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'address' }] },
  { type: 'function', name: 'totalEthRaised', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'tokensSold', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  // Fee Claiming
  { type: 'function', name: 'claimFees', stateMutability: 'nonpayable', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  // Events
  { type: 'event', name: 'Buy', inputs: [
    { indexed: true, name: 'buyer', type: 'address' },
    { indexed: false, name: 'ethSpent', type: 'uint256' },
    { indexed: false, name: 'tokensReceived', type: 'uint256' },
    { indexed: false, name: 'price', type: 'uint256' }
  ], anonymous: false },
  { type: 'event', name: 'Sell', inputs: [
    { indexed: true, name: 'seller', type: 'address' },
    { indexed: false, name: 'tokensSold', type: 'uint256' },
    { indexed: false, name: 'ethReceived', type: 'uint256' },
    { indexed: false, name: 'price', type: 'uint256' }
  ], anonymous: false },
  { type: 'event', name: 'Graduated', inputs: [
    { indexed: false, name: 'finalPrice', type: 'uint256' },
    { indexed: false, name: 'totalRaised', type: 'uint256' }
  ], anonymous: false },
] as const satisfies Abi

// ERC20: Token contract
export const erc20Abi = [
  // Token Info
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  // Balance & Allowance
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'allowance', stateMutability: 'view', inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], outputs: [{ type: 'uint256' }] },
  // Transfer & Approval
  { type: 'function', name: 'transfer', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'approve', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  { type: 'function', name: 'transferFrom', stateMutability: 'nonpayable', inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
  // Events
  { type: 'event', name: 'Transfer', inputs: [
    { indexed: true, name: 'from', type: 'address' },
    { indexed: true, name: 'to', type: 'address' },
    { indexed: false, name: 'value', type: 'uint256' }
  ], anonymous: false },
  { type: 'event', name: 'Approval', inputs: [
    { indexed: true, name: 'owner', type: 'address' },
    { indexed: true, name: 'spender', type: 'address' },
    { indexed: false, name: 'value', type: 'uint256' }
  ], anonymous: false },
] as const satisfies Abi

// FeeManager: Fee distribution
export const feeManagerAbi = [
  // Fee Distribution
  { type: 'function', name: 'distributeETH', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'distributeToken', stateMutability: 'nonpayable', inputs: [{ name: 'token', type: 'address' }], outputs: [] },
  { type: 'function', name: 'receiveToken', stateMutability: 'nonpayable', inputs: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ], outputs: [] },
  // Fee Balance Queries
  { type: 'function', name: 'getEthBalance', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'getTokenBalance', stateMutability: 'view', inputs: [{ name: 'token', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  // Emergency Functions
  { type: 'function', name: 'emergencyWithdrawETH', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'emergencyWithdrawToken', stateMutability: 'nonpayable', inputs: [{ name: 'token', type: 'address' }], outputs: [] },
  { type: 'function', name: 'pause', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  // Admin
  { type: 'function', name: 'owner', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'address' }] },
  // Events
  { type: 'event', name: 'FeeDistributed', inputs: [
    { indexed: true, name: 'token', type: 'address' },
    { indexed: false, name: 'treasuryAmount', type: 'uint256' },
    { indexed: false, name: 'teamAmount', type: 'uint256' },
    { indexed: false, name: 'marketingAmount', type: 'uint256' }
  ], anonymous: false },
  { type: 'event', name: 'EthReceived', inputs: [
    { indexed: true, name: 'sender', type: 'address' },
    { indexed: false, name: 'amount', type: 'uint256' }
  ], anonymous: false },
] as const satisfies Abi

// AntiBotManager: Bot protection
export const antiBotManagerAbi = [
  { type: 'function', name: 'validate', stateMutability: 'view', inputs: [
    { name: 'token', type: 'address' },
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ], outputs: [{ name: '', type: 'bool' }] },
  { type: 'function', name: 'isBlacklisted', stateMutability: 'view', inputs: [{ name: 'address_', type: 'address' }], outputs: [{ name: '', type: 'bool' }] },
  { type: 'function', name: 'addToBlacklist', stateMutability: 'nonpayable', inputs: [{ name: 'address_', type: 'address' }], outputs: [] },
] as const satisfies Abi

// ReferralSystem: Referral rewards
export const referralSystemAbi = [
  { type: 'function', name: 'register', stateMutability: 'nonpayable', inputs: [{ name: 'referrer', type: 'address' }], outputs: [] },
  { type: 'function', name: 'getReferralFee', stateMutability: 'view', inputs: [{ name: 'referrer', type: 'address' }], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'claimReferralFee', stateMutability: 'nonpayable', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
] as const satisfies Abi

// LPLocker: Liquidity locking
export const lpLockerAbi = [
  { type: 'function', name: 'lock', stateMutability: 'nonpayable', inputs: [
    { name: 'lpToken', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'unlockTime', type: 'uint256' }
  ], outputs: [{ name: 'lockId', type: 'uint256' }] },
  { type: 'function', name: 'unlock', stateMutability: 'nonpayable', inputs: [{ name: 'lockId', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'getLockInfo', stateMutability: 'view', inputs: [{ name: 'lockId', type: 'uint256' }], outputs: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'unlockTime', type: 'uint256' }
  ] },
] as const satisfies Abi
