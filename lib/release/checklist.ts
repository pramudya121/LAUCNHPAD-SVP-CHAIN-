export type ReleaseCheck = { id: string; label: string; required: boolean; status: 'pass' | 'pending' | 'blocked' }

export const phaseNineTenChecklist: ReleaseCheck[] = [
  { id: 'public-routes', label: 'Every public route works from a direct URL', required: true, status: 'pass' },
  { id: 'freshness', label: 'Financial metrics expose source and freshness', required: true, status: 'pass' },
  { id: 'api-ownership', label: 'API keys are scoped to an authenticated organization', required: true, status: 'blocked' },
  { id: 'webhook-signing', label: 'Webhook signatures are verified before dispatch', required: true, status: 'blocked' },
  { id: 'typecheck-build', label: 'Typecheck and production build pass', required: true, status: 'pass' },
  { id: 'browser-smoke', label: 'Browser smoke and mobile checks pass', required: true, status: 'pass' },
  { id: 'accessibility', label: 'WCAG 2.2 AA audit is complete', required: true, status: 'pending' },
]

export function requiredChecksReady(checks = phaseNineTenChecklist) { return checks.filter(check => check.required).every(check => check.status === 'pass') }
