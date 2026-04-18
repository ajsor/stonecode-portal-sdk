import type { Session } from '@supabase/supabase-js'

export const PORTAL_URL = 'https://stonecode.ai'

export type SatelliteApp =
  | 'aether'
  | 'relaite'
  | 'mb-dashboard'
  | 'adam'

export const SATELLITE_URLS: Record<SatelliteApp, string> = {
  aether: 'https://aether.stonecode.ai',
  relaite: 'https://relaite.stonecode.ai',
  'mb-dashboard': 'https://mb-dashboard.stonecode.ai',
  adam: 'https://adam.stonecode.ai',
}

/**
 * Build a deep-link URL that opens a satellite app with the caller's Supabase
 * session attached as a URL hash. The satellite consumes this via
 * `bootstrapSessionFromHash` and strips the hash from the address bar.
 *
 * Tokens in the hash stay out of referers/server logs but are visible in
 * browser history. Treat the hand-off as a short window; the satellite should
 * scrub it immediately on load.
 */
export function buildPortalLaunchUrl(
  app: SatelliteApp | string,
  session: Pick<Session, 'access_token' | 'refresh_token'>,
  path: string = '/'
): string {
  const base = isSatelliteKey(app) ? SATELLITE_URLS[app] : app
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const hashParams = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    type: 'portal',
  })
  return `${base}${normalizedPath}#${hashParams.toString()}`
}

function isSatelliteKey(value: string): value is SatelliteApp {
  return value in SATELLITE_URLS
}
