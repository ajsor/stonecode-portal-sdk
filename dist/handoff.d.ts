import type { SupabaseClient, Session } from '@supabase/supabase-js';
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
    code: string | null;
    error?: string;
}
/**
 * Exchange the current session for a one-time handoff code.
 * Requires a signed-in Supabase client (the edge function verifies the
 * caller's JWT and that the tokens being stored belong to that caller).
 */
export declare function createSessionHandoff(supabase: SupabaseClient, session: Pick<Session, 'access_token' | 'refresh_token'>): Promise<HandoffCreateResult>;
/**
 * Redeem a handoff code for the session tokens it references.
 * Used internally by `bootstrapSessionFromHash`; exported for satellites
 * with custom bootstrap flows.
 */
export declare function redeemSessionHandoff(supabase: SupabaseClient, code: string): Promise<{
    access_token: string;
    refresh_token: string;
} | {
    error: string;
}>;
//# sourceMappingURL=handoff.d.ts.map