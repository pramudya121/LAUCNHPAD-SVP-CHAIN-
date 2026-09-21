import type { Address } from 'viem'

export type WalletOwnershipChallenge = {
  address: Address
  chainId: number
  nonce: string
  message: string
  issuedAt: string
}

export function createOwnershipMessage(address: Address, chainId: number, nonce: string, issuedAt = new Date().toISOString()): WalletOwnershipChallenge {
  if (!nonce || nonce.length < 16) throw new Error('Ownership nonce must be server-issued and high entropy.')
  return {
    address,
    chainId,
    nonce,
    issuedAt,
    message: `LUNAFAD wallet ownership verification\n\nAddress: ${address}\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued at: ${issuedAt}\n\nThis signature only proves control of the wallet. It does not authorize a transaction.`,
  }
}

export function assertOwnershipAddress(expected: Address, recovered: Address) {
  if (expected.toLowerCase() !== recovered.toLowerCase()) throw new Error('Signed wallet does not match the active wallet address.')
}

export const ownershipPersistenceStatus = 'requires-server-issued nonce, signature recovery, expiry, replay protection, and Supabase RLS before linking.' as const
