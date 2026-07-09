import type { SupabaseClient, Session } from '@supabase/supabase-js'
import { redeemSessionHandoff } from './handoff.js'

export interface BootstrapResult {
  session: Session | null
  source: 'handoff' | 'hash' | 'existing' | 'none'
  error?: string
}

/**
 * Bootstrap the Supabase session from the launch URL, falling back to any
 * existing persisted session.
 *
 * Supports two hash formats:
 *   - `#handoff_code=...&type=portal` (preferred, SDK >= 0.2.0): a one-time
 *     code redeemed server-side — no tokens ever touch the URL.
 *   - `#access_token=...&refresh_token=...&type=portal` (legacy): raw tokens
 *     in the hash. Still accepted so older portals can launch newer
 *     satellites during the migration.
 *
 * Call this once at app startup — before any routing decisions that depend on
 * whether the user is signed in.
 *
 * Always scrubs the hash from the address bar so codes/tokens don't linger in
 * browser history, referrers, or analytics.
 */
export async function bootstrapSessionFromHash(
  supabase: SupabaseClient
): Promise<BootstrapResult> {
  if (typeof window === 'undefined') {
    return { session: null, source: 'none' }
  }

  const hash = window.location.hash

  if (hash && hash.includes('handoff_code=')) {
    const params = new URLSearchParams(hash.slice(1))
    const code = params.get('handoff_code')
    stripSessionHash()
    if (code) {
      const redeemed = await redeemSessionHandoff(supabase, code)
      if ('error' in redeemed) {
        return { session: null, source: 'handoff', error: redeemed.error }
      }
      const { data, error } = await supabase.auth.setSession(redeemed)
      if (error) {
        return { session: null, source: 'handoff', error: error.message }
      }
      return { session: data.session, source: 'handoff' }
    }
  }

  if (hash && hash.includes('access_token=')) {
    const params = new URLSearchParams(hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    // Scrub unconditionally — previously a hash with access_token but no
    // refresh_token was left sitting in the address bar.
    stripSessionHash()

    if (access_token && refresh_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })
      if (error) {
        return { session: null, source: 'hash', error: error.message }
      }
      return { session: data.session, source: 'hash' }
    }
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    return { session: null, source: 'none', error: error.message }
  }
  return {
    session: data.session,
    source: data.session ? 'existing' : 'none',
  }
}

/**
 * Remove the auth hash from the URL without reloading, preserving the pathname
 * and query string. Safe to call even if no hash is present.
 */
export function stripSessionHash(): void {
  if (typeof window === 'undefined') return
  const hash = window.location.hash
  if (!hash) return
  if (!hash.includes('access_token=') && !hash.includes('handoff_code=')) return
  const { pathname, search } = window.location
  window.history.replaceState(null, '', pathname + search)
}

/**
 * Alias retained for callers that want an explicit name.
 */
export const clearSessionHash = stripSessionHash
