import { createClient } from '@supabase/supabase-js';
/**
 * Canonical Supabase client factory shared by all portal apps. Guarantees
 * consistent auth defaults so session handoff between stonecode.ai and
 * satellites works predictably.
 */
export function createPortalSupabaseClient(opts) {
    if (!opts.url || !opts.anonKey) {
        console.warn('[portal-sdk] Missing Supabase url/anonKey; returning placeholder client.');
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