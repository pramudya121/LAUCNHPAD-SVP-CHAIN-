export const publicRoutes = ['/', '/explore', '/trending', '/leaderboard', '/portfolio', '/create', '/creator', '/notifications', '/settings', '/teams', '/admin', '/system-health'] as const

export type PublicRoute = (typeof publicRoutes)[number]

export function isPublicRoute(pathname: string): pathname is PublicRoute {
  return publicRoutes.includes(pathname as PublicRoute)
}
