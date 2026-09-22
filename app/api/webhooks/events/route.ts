import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const signature = request.headers.get('x-lunafad-signature')
  if (!signature) return NextResponse.json({ error: 'Missing webhook signature.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid event payload.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } })
  return NextResponse.json({ accepted: false, reason: 'Webhook verification is not configured for this environment.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
}

export async function GET() { return NextResponse.json({ service: 'lunafad-webhooks', status: 'unconfigured' }, { headers: { 'Cache-Control': 'no-store' } }) }
