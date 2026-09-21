'use client'

import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries, HistogramSeries, ColorType, type IChartApi, type UTCTimestamp } from 'lightweight-charts'
import type { Candle } from '@/lib/hooks/use-terminal-chart'

type TerminalChartProps = { candles: Candle[]; live: boolean }

export function TerminalChart({ candles, live }: TerminalChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<Array<{ setData: (data: unknown[]) => void }>>([])

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: '#111722' }, textColor: '#8c98ab' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.04)' }, horzLines: { color: 'rgba(255,255,255,0.04)' } },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.08)' },
      timeScale: { borderColor: 'rgba(255,255,255,0.08)', timeVisible: true, secondsVisible: false },
      crosshair: { mode: 1 },
    })
    const candleSeries = chart.addSeries(CandlestickSeries, { upColor: '#71d7ba', downColor: '#e87984', borderVisible: false, wickUpColor: '#71d7ba', wickDownColor: '#e87984' })
    const volumeSeries = chart.addSeries(HistogramSeries, { priceFormat: { type: 'volume' }, priceScaleId: '' })
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } })
    chartRef.current = chart
    seriesRef.current = [candleSeries, volumeSeries] as unknown as Array<{ setData: (data: unknown[]) => void }>
    return () => { chart.remove(); chartRef.current = null; seriesRef.current = [] }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart || candles.length === 0 || seriesRef.current.length < 2) return
    const [candleSeries, volumeSeries] = seriesRef.current
    candleSeries.setData(candles.map(candle => ({ time: candle.time as UTCTimestamp, open: candle.open, high: candle.high, low: candle.low, close: candle.close })))
    volumeSeries.setData(candles.map(candle => ({ time: candle.time as UTCTimestamp, value: candle.volume, color: candle.close >= candle.open ? 'rgba(113,215,186,0.35)' : 'rgba(232,121,132,0.35)' })))
    chart.timeScale().fitContent()
  }, [candles])

  return <div className="relative h-[320px] w-full" ref={containerRef}>
    {candles.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-sm text-[#718096]">Waiting for indexed candles from SVP Chain…</div>}
    <div className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0f16]/80 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#8c98ab]"><span className={`size-1.5 rounded-full ${live ? 'bg-[#71d7ba]' : 'bg-[#718096]'}`} />{live ? 'Live' : 'Indexed'}</div>
  </div>
}

export default TerminalChart
