import type { SupabaseClient, Session } from '@supabase/supabase-js';
export interface BootstrapResult {
    session: Session | null;
    source: 'handoff' | 'hash' | 'existing' | 'none';
    error?: string;
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