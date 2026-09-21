import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lunafad.app'
  return { rules: [{ userAgent: '*', allow: ['/', '/explore', '/trending', '/leaderboard'], disallow: ['/api/', '/admin', '/settings', '/teams', '/notifications'] }], sitemap: `${baseUrl}/sitemap.xml` }
}
