export type QualityGate = {
  name: string
  command: string
  required: boolean
}

export const releaseQualityGates: QualityGate[] = [
  { name: 'Type safety', command: 'pnpm typecheck', required: true },
  { name: 'Production build', command: 'pnpm build', required: true },
  { name: 'Browser smoke tests', command: 'agent-browser', required: true },
  { name: 'Contract fixture tests', command: 'testnet fixture suite', required: true },
  { name: 'Accessibility audit', command: 'WCAG 2.2 AA audit', required: true },
]

export function requiredQualityGatesPassed(results: Record<string, boolean>) {
  return releaseQualityGates.filter((gate) => gate.required).every((gate) => results[gate.name] === true)
}
