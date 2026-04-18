import type { SupabaseClient, Session } from '@supabase/supabase-js';
export interface BootstrapResult {
    session: Session | null;
    source: 'hash' | 'existing' | 'none';
    error?: string;
}
/**
 * Parse tokens from the URL hash (`#access_token=...&refresh_token=...&type=portal`)
 * and hand them to Supabase. Falls back to any existing session.
 *
 * Call this once at app startup — before any routing decisions that depend on
 * whether the user is signed in.
 *
 * Always scrubs the hash from the address bar on success so the tokens don't
 * end up in browser history, referrers, or analytics.
 */
export declare function bootstrapSessionFromHash(supabase: SupabaseClient): Promise<BootstrapResult>;
/**
 * Remove the auth hash from the URL without reloading, preserving the pathname
 * and query string. Safe to call even if no hash is present.
 */
export declare function stripSessionHash(): void;
/**
 * Alias retained for callers that want an explicit name.
 */
export declare const clearSessionHash: typeof stripSessionHash;
//# sourceMappingURL=auth.d.ts.map