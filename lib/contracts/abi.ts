import type { Abi } from 'viem'

export const launchpadFactoryAbi = [
  { type: 'function', name: 'createToken', stateMutability: 'payable', inputs: [{ name: 'name', type: 'string' }, { name: 'symbol', type: 'string' }, { name: 'totalSupply', type: 'uint256' }, { name: 'decimals', type: 'uint8' }], outputs: [{ name: 'token', type: 'address' }, { name: 'curve', type: 'address' }] },
  { type: 'function', name: 'getTokens', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'address[]' }] },
  { type: 'function', name: 'creationFee', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'event', name: 'TokenCreated', inputs: [{ indexed: true, name: 'token', type: 'address' }, { indexed: true, name: 'curve', type: 'address' }, { indexed: true, name: 'creator', type: 'address' }], anonymous: false },
] as const satisfies Abi

export const bondingCurveAbi = [
  { type: 'function', name: 'buy', stateMutability: 'payable', inputs: [{ name: 'minTokensOut', type: 'uint256' }, { name: 'referrer', type: 'address' }], outputs: [] },
  { type: 'function', name: 'sell', stateMutability: 'nonpayable', inputs: [{ name: 'tokenAmount', type: 'uint256' }, { name: 'minEthOut', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'getPrice', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'getProgress', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint256' }] },
  { type: 'function', name: 'graduated', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'bool' }] },
] as const satisfies Abi

export const erc20Abi = [
  { type: 'function', name: 'name', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'symbol', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
  { type: 'function', name: 'decimals', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
  { type: 'function', name: 'totalSupply', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'balanceOf', stateMutability: 'view', inputs: [{ name: 'account', type: 'address' }], outputs: [{ type: 'uint256' }] },
  { type: 'function', name: 'approve', stateMutability: 'nonpayable', inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ type: 'bool' }] },
] as const satisfies Abi

export const feeManagerAbi = [
  { type: 'function', name: 'distributeETH', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'distributeToken', stateMutability: 'nonpayable', inputs: [{ name: 'token', type: 'address' }], outputs: [] },
  { type: 'function', name: 'receiveToken', stateMutability: 'nonpayable', inputs: [{ name: 'token', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [] },
  { type: 'function', name: 'emergencyWithdrawETH', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'function', name: 'emergencyWithdrawToken', stateMutability: 'nonpayable', inputs: [{ name: 'token', type: 'address' }], outputs: [] },
  { type: 'function', name: 'pause', stateMutability: 'nonpayable', inputs: [], outputs: [] },
  { type: 'event', name: 'FeeDistributed', inputs: [{ indexed: true, name: 'token', type: 'address' }, { indexed: false, name: 'treasuryAmount', type: 'uint256' }, { indexed: false, name: 'teamAmount', type: 'uint256' }, { indexed: false, name: 'marketingAmount', type: 'uint256' }], anonymous: false },
] as const satisfies Abi
