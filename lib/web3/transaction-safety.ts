import { BaseError, ContractFunctionRevertedError, type Address, type Hash } from 'viem'
import { isConfiguredAddress, SVP_TESTNET } from '@/lib/contracts/config'

export type TransactionStage = 'idle' | 'validating' | 'awaiting_wallet' | 'submitted' | 'confirming' | 'confirmed' | 'failed'

export type TransactionState = {
  stage: TransactionStage
  hash?: Hash
  error?: string
}

export function assertConfiguredAddress(address: string, label = 'Contract') {
  if (!isConfiguredAddress(address)) throw new Error(`${label} is not configured for this environment.`)
  return address as Address
}

export function assertChainId(chainId?: number) {
  if (chainId !== undefined && chainId !== SVP_TESTNET.id) {
    throw new Error(`Wrong network. Switch to ${SVP_TESTNET.name} (chain ${SVP_TESTNET.id}).`)
  }
}

export function assertPositiveDecimal(value: string, label: string) {
  if (!value.trim() || !Number.isFinite(Number(value)) || Number(value) <= 0) {
    throw new Error(`${label} must be greater than zero.`)
  }
}

export function assertSlippage(value: string) {
  const slippage = Number(value)
  if (!Number.isFinite(slippage) || slippage < 0 || slippage > 50) {
    throw new Error('Slippage must be between 0% and 50%.')
  }
  return slippage
}

export function formatTransactionError(error: unknown) {
  if (error instanceof ContractFunctionRevertedError) return 'The contract rejected this action. Check the amount, allowance, slippage, and token state.'
  if (error instanceof BaseError) {
    const message = error.shortMessage.toLowerCase()
    if (message.includes('user rejected') || message.includes('denied')) return 'The wallet signature was cancelled.'
    if (message.includes('insufficient funds')) return 'Insufficient SVP for this action and network gas.'
    if (message.includes('chain')) return 'Wrong network. Switch to SVP Chain Testnet and try again.'
    return error.shortMessage
  }
  return error instanceof Error ? error.message : 'Transaction failed. Please try again.'
}

export function explorerTransactionUrl(explorerUrl: string, hash?: string) {
  return hash ? `${explorerUrl.replace(/\/$/, '')}/tx/${hash}` : undefined
}
