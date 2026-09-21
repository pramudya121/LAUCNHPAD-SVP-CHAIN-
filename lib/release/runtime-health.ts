export type RuntimeHealth = { status: 'ok' | 'degraded'; service: string; timestamp: string }

export async function readRuntimeHealth(baseUrl: string): Promise<RuntimeHealth> {
  const response = await fetch(`${baseUrl}/api/health`, { cache: 'no-store' })
  if (!response.ok) throw new Error(`Health endpoint returned ${response.status}`)
  return response.json() as Promise<RuntimeHealth>
}
