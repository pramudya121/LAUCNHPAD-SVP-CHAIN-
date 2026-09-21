import type { MetadataRoute } from 'next'

const publicRoutes = ['/', '/explore', '/trending', '/leaderboard', '/portfolio', '/create', '/creator', '/notifications', '/settings', '/teams', '/admin', '/system-health']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lunafad.app'
  return publicRoutes.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: path === '/' ? 'daily' : 'hourly', priority: path === '/' ? 1 : 0.7 }))
}
