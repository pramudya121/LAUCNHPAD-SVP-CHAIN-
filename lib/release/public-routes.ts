export const publicRoutes = ['/', '/overview', '/explore', '/trending', '/leaderboard', '/portfolio', '/create', '/creator', '/notifications', '/settings', '/api-access', '/release-status', '/quality-center', '/security-center', '/ecosystem', '/teams', '/admin', '/system-health'] as const

export type PublicRoute = (typeof publicRoutes)[number]

export function isPublicRoute(pathname: string): pathname is PublicRoute {
  return publicRoutes.includes(pathname as PublicRoute)
}
