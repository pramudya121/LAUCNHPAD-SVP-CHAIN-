import { parseUnits } from 'viem'
import { assertPositiveDecimal, assertSlippage } from './transaction-safety'

export type TradeQuote = {
  input: bigint
  expectedOutput: bigint
  minimumOutput: bigint
  slippagePercent: number
  priceImpactPercent: number | null
}

export function buildTradeQuote(inputText: string, priceText: string, slippageText: string, side: 'buy' | 'sell', decimals = 18): TradeQuote {
  assertPositiveDecimal(inputText, side === 'buy' ? 'SVP amount' : 'Token amount')
  const price = Number(priceText)
  if (!Number.isFinite(price) || price <= 0) throw new Error('A live quote is required before trading.')
  const slippagePercent = assertSlippage(slippageText)
  const input = parseUnits(inputText, decimals)
  const expectedOutput = side === 'buy'
    ? parseUnits((Number(inputText) / price).toFixed(Math.min(decimals, 18)), decimals)
    : parseUnits((Number(inputText) * price).toFixed(Math.min(decimals, 18)), decimals)
  const minimumOutput = expectedOutput * BigInt(Math.round((100 - slippagePercent) * 100)) / 10000n
  return { input, expectedOutput, minimumOutput, slippagePercent, priceImpactPercent: null }
}

export function formatQuoteAmount(value: bigint, decimals = 18) {
  const text = value.toString().padStart(decimals + 1, '0')
  const split = text.length - decimals
  return `${text.slice(0, split)}.${text.slice(split, split + 6)}`
}
