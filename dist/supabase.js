import { createClient } from '@supabase/supabase-js';
/**
 * Canonical Supabase client factory shared by all portal apps. Guarantees
 * consistent auth defaults so session handoff between stonecode.ai and
 * satellites works predictably.
 *
 * Throws when url/anonKey are missing (misconfigured build) unless
 * `allowPlaceholder` is set.
 */
export function createPortalSupabaseClient(opts) {
    if (!opts.url || !opts.anonKey) {
        if (!opts.allowPlaceholder) {
            throw new Error('[portal-sdk] Missing Supabase url/anonKey. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the build environment.');
        }
        console.warn('[portal-sdk] Missing Supabase url/anonKey; returning placeholder client (allowPlaceholder).');
    }
    return createClient(opts.url || 'https://placeholder.supabase.co', opts.anonKey || 'placeholder-key', {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            storageKey: opts.storageKey,
            ...(opts.authOverrides ?? {}),
        },
    });
}
//# sourceMappingURL=supabase.js.map