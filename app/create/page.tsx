'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ExternalLink, Rocket, Wallet } from 'lucide-react'
import { parseEther } from 'viem'
import { connectWallet, publicClient } from '@/lib/web3/client'
import { CONTRACT_ADDRESSES, CREATION_FEE, explorerTx, isConfiguredAddress } from '@/lib/contracts/config'
import { launchpadFactoryAbi } from '@/lib/contracts/abi'

type FormState = { name: string; symbol: string; supply: string; decimals: string; description: string }
type DeployStatus = 'idle' | 'wallet' | 'confirm' | 'submitted' | 'confirmed' | 'error' | 'missing-contract'

const initialForm: FormState = { name: '', symbol: '', supply: '1000000000', decimals: '18', description: '' }

export default function CreateTokenPage() {
  const [form, setForm] = useState(initialForm)
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<DeployStatus>('idle')
  const [hash, setHash] = useState('')
  const [error, setError] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const validation = useMemo(() => {
    const nameOk = form.name.trim().length >= 2 && form.name.trim().length <= 32
    const symbolOk = /^[A-Za-z0-9]{2,10}$/.test(form.symbol.trim())
    const supplyOk = /^[1-9][0-9]*$/.test(form.supply)
    const decimalsOk = Number(form.decimals) >= 0 && Number(form.decimals) <= 18
    const descriptionOk = form.description.trim().length <= 500
    return { nameOk, symbolOk, supplyOk, decimalsOk, descriptionOk, valid: nameOk && symbolOk && supplyOk && decimalsOk && descriptionOk }
  }, [form])

  const update = (key: keyof FormState, value: string) => setForm(current => ({ ...current, [key]: value }))
  const nextStep = () => { if (step === 1 && validation.valid) setStep(2); else if (step === 2) setStep(3) }
  const deploy = async () => {
    if (!validation.valid) { setError('Review the required fields before deploying.'); setStep(1); return }
    if (!isConfiguredAddress(CONTRACT_ADDRESSES.FACTORY)) { setStatus('missing-contract'); return }
    try {
      setError(''); setStatus('wallet')
      const { wallet, account } = await connectWallet()
      setWalletAddress(account)
      setStatus('confirm')
      const tx = await wallet.writeContract({ address: CONTRACT_ADDRESSES.FACTORY, abi: launchpadFactoryAbi, chain: null, functionName: 'createToken', args: [form.name.trim(), form.symbol.trim().toUpperCase(), BigInt(form.supply) * 10n ** BigInt(form.decimals), Number(form.decimals), form.description.trim(), ''], value: parseEther(CREATION_FEE), account })
      setHash(tx); setStatus('submitted')
      await publicClient.waitForTransactionReceipt({ hash: tx })
      setStatus('confirmed')
    } catch (cause) { setStatus('error'); setError(cause instanceof Error ? cause.message : 'Transaction failed. Review your wallet and try again.') }
  }
  const busy = status === 'wallet' || status === 'confirm' || status === 'submitted'
  return <main className="min-h-screen bg-[#0b0f16] px-5 py-8 text-white lg:px-10"><div className="mx-auto max-w-6xl"><Link href="/" className="text-xs text-[#8eb1eb]">← Back to LUNAFAD</Link><div className="mt-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11px] uppercase tracking-[.2em] text-[#71d7ba]">Launchpad</p><h1 className="mt-2 text-3xl font-semibold">Create a token</h1><p className="mt-2 max-w-xl text-sm text-[#8c98ab]">Deploy directly through LaunchpadFactory on SVP Chain with a review step before signing.</p></div><div className="text-right text-xs text-[#71809a]">Creation fee <span className="font-medium text-white">{CREATION_FEE} SVP</span></div></div><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]"><section className="rounded-xl border border-white/10 bg-[#111722] p-6"><div className="mb-8 grid grid-cols-3 gap-2">{['Details', 'Review', 'Deploy'].map((label, index) => <div key={label} className={`border-b-2 pb-3 text-xs ${step === index + 1 ? 'border-[#71d7ba] text-white' : step > index + 1 ? 'border-[#345d9d] text-[#8eb1eb]' : 'border-white/10 text-[#71809a]'}`}><span className="mr-2">{index + 1}</span>{label}</div>)}</div>{step === 1 && <div><div className="grid gap-4 sm:grid-cols-2"><Field label="Token name" value={form.name} placeholder="e.g. Moon Cat" error={!validation.nameOk && form.name.length > 0 ? 'Use 2–32 characters.' : ''} onChange={value => update('name', value)} /><Field label="Symbol" value={form.symbol} placeholder="MCAT" error={!validation.symbolOk && form.symbol.length > 0 ? 'Use 2–10 letters or numbers.' : ''} onChange={value => update('symbol', value.toUpperCase())} /><Field label="Total supply" value={form.supply} placeholder="1000000000" error={!validation.supplyOk ? 'Use a positive whole number.' : ''} onChange={value => update('supply', value.replace(/[^0-9]/g, ''))} /><label className="text-xs text-[#a5a8a9]">Decimals<select value={form.decimals} onChange={event => update('decimals', event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#111722] px-3 text-sm"><option>6</option><option>8</option><option>9</option><option>18</option></select></label></div><label className="mt-4 block text-xs text-[#a5a8a9]">Description <span className="text-[#71809a]">({form.description.length}/500)</span><textarea value={form.description} onChange={event => update('description', event.target.value)} className="mt-2 min-h-28 w-full rounded-lg border border-white/10 bg-white/[.03] px-3 py-3 text-sm outline-none focus:border-[#345d9d]" placeholder="Explain what this token is for." /></label><button onClick={nextStep} disabled={!validation.valid} className="mt-6 w-full rounded-lg bg-[#345d9d] py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40">Continue to review</button></div>}{step === 2 && <Review form={form} onBack={() => setStep(1)} onContinue={() => setStep(3)} />}{step === 3 && <DeployPanel status={status} hash={hash} walletAddress={walletAddress} error={error} busy={busy} onBack={() => setStep(2)} onDeploy={deploy} onReset={() => { setForm(initialForm); setStep(1); setStatus('idle'); setHash(''); setError('') }} />}</section><aside className="rounded-xl border border-white/10 bg-[#111722] p-6"><p className="text-xs uppercase tracking-wider text-[#71809a]">Launch checklist</p><div className="mt-5 space-y-4">{['Metadata is validated locally', 'Contract arguments are shown before signing', 'Wallet confirmation is required', 'Receipt is waited on after submission', 'Transaction hash links to explorer'].map(item => <div key={item} className="flex gap-3 text-sm text-[#b9c3d1]"><Check className="mt-0.5 size-4 shrink-0 text-[#71d7ba]" />{item}</div>)}</div></aside></div></div></main>
}

function Field({ label, value, placeholder, error, onChange }: { label: string; value: string; placeholder: string; error?: string; onChange: (value: string) => void }) { return <label className="text-xs text-[#a5a8a9]">{label}<input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className={`mt-2 h-11 w-full rounded-lg border bg-white/[.03] px-3 text-sm outline-none focus:border-[#345d9d] ${error ? 'border-[#e87984]' : 'border-white/10'}`} />{error && <span className="mt-1 block text-[11px] text-[#e87984]">{error}</span>}</label> }
function Review({ form, onBack, onContinue }: { form: FormState; onBack: () => void; onContinue: () => void }) { return <div><h2 className="text-lg font-medium">Review deployment</h2><p className="mt-2 text-sm text-[#8c98ab]">These exact values will be passed to LaunchpadFactory.</p><div className="mt-6 divide-y divide-white/[0.06] rounded-lg border border-white/10">{[['Name', form.name], ['Symbol', form.symbol.toUpperCase()], ['Supply', Number(form.supply).toLocaleString()], ['Decimals', form.decimals], ['Description', form.description || 'No description']].map(([label, value]) => <div key={label} className="flex justify-between gap-4 px-4 py-3 text-sm"><span className="text-[#71809a]">{label}</span><span className="max-w-[65%] text-right text-white">{value}</span></div>)}</div><div className="mt-6 flex gap-3"><button onClick={onBack} className="flex-1 rounded-lg border border-white/10 py-3 text-sm">Back</button><button onClick={onContinue} className="flex-1 rounded-lg bg-[#345d9d] py-3 text-sm font-medium">Continue to deploy</button></div></div> }
function DeployPanel({ status, hash, walletAddress, error, busy, onBack, onDeploy, onReset }: { status: DeployStatus; hash: string; walletAddress: string; error: string; busy: boolean; onBack: () => void; onDeploy: () => void; onReset: () => void }) { const message = status === 'missing-contract' ? 'Factory contract address is not configured for this environment.' : status === 'wallet' ? 'Opening your wallet…' : status === 'confirm' ? 'Confirm the deployment in your wallet.' : status === 'submitted' ? 'Transaction submitted. Waiting for confirmation…' : status === 'confirmed' ? 'Token deployment confirmed on SVP Chain.' : status === 'error' ? error : 'Ready to deploy.'; return <div><div className="flex size-12 items-center justify-center rounded-xl bg-[#345d9d]/20"><Rocket className="size-5 text-[#8eb1eb]" /></div><h2 className="mt-4 text-lg font-medium">Deploy on SVP Chain</h2><p className="mt-2 text-sm leading-6 text-[#8c98ab]">{message}</p>{walletAddress && <p className="mt-3 font-mono text-xs text-[#71809a]">Wallet: {walletAddress.slice(0, 8)}…{walletAddress.slice(-6)}</p>}{hash && <a href={explorerTx(hash)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-[#8eb1eb]">View transaction <ExternalLink className="size-3" /></a>}<div className="mt-8 flex gap-3">{status === 'confirmed' ? <button onClick={onReset} className="flex-1 rounded-lg bg-[#345d9d] py-3 text-sm font-medium">Create another token</button> : <><button onClick={onBack} disabled={busy} className="flex-1 rounded-lg border border-white/10 py-3 text-sm disabled:opacity-40">Back</button><button onClick={onDeploy} disabled={busy} className="flex-1 rounded-lg bg-[#345d9d] py-3 text-sm font-medium disabled:opacity-40">{busy ? 'Processing…' : <><Wallet className="mr-2 inline size-4" />Sign deployment</>}</button></>}</div></div> }
