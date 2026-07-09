import type { SupabaseClient, Session } from '@supabase/supabase-js'

/**
 * One-time session handoff between the portal and satellite apps.
 *
 * The legacy launch flow put the access AND refresh token in the URL hash of
 * the new tab, which persists them in browser history (a refresh token in
 * history is a long-lived credential). The handoff flow instead:
 *
 *   1. Portal calls `createSessionHandoff` — the `portal-handoff` edge
 *      function stores the session server-side and returns a random,
 *      short-lived (120s), single-use code.
 *   2. The satellite URL carries only `#handoff_code=...`.
 *   3. The satellite's `bootstrapSessionFromHash` redeems the code (the row
 *      is deleted atomically on redemption) and installs the session.
 *
 * A leaked or history-recovered code is useless after redemption or expiry.
 */

export interface HandoffCreateResult {
  code: string | null
  error?: string
}

/**
 * Exchange the current session for a one-time handoff code.
 * Requires a signed-in Supabase client (the edge function verifies the
 * caller's JWT and that the tokens being stored belong to that caller).
 */
export async function createSessionHandoff(
  supabase: SupabaseClient,
  session: Pick<Session, 'access_token' | 'refresh_token'>
): Promise<HandoffCreateResult> {
  const { data, error } = await supabase.functions.invoke('portal-handoff', {
    body: {
      op: 'create',
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    },
  })
  if (error) return { code: null, error: error.message }
  if (!data?.code) return { code: null, error: 'No code returned' }
  return { code: data.code as string }
}

/**
 * Redeem a handoff code for the session tokens it references.
 * Used internally by `bootstrapSessionFromHash`; exported for satellites
 * with custom bootstrap flows.
 */
export async function redeemSessionHandoff(
  supabase: SupabaseClient,
  code: string
): Promise<{ access_token: string; refresh_token: string } | { error: string }> {
  const { data, error } = await supabase.functions.invoke('portal-handoff', {
    body: { op: 'redeem', code },
  })
  if (error) return { error: error.message }
  if (!data?.access_token || !data?.refresh_token) {
    return { error: 'Handoff code invalid or expired' }
  }
  return {
    access_token: data.access_token as string,
    refresh_token: data.refresh_token as string,
  }
}
