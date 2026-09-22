import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'lunafad-web', version: process.env.VERCEL_GIT_COMMIT_SHA ?? 'development', timestamp: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } })
}
