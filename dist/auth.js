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
export async function bootstrapSessionFromHash(supabase) {
    if (typeof window === 'undefined') {
        return { session: null, source: 'none' };
    }
    const hash = window.location.hash;
    if (hash && hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.slice(1));
        const access_token = params.get('access_token');
        const refresh_token = params.get('refresh_token');
        if (access_token && refresh_token) {
            const { data, error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
            });
            stripSessionHash();
            if (error) {
                return { session: null, source: 'hash', error: error.message };
            }
            return { session: data.session, source: 'hash' };
        }
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        return { session: null, source: 'none', error: error.message };
    }
    return {
        session: data.session,
        source: data.session ? 'existing' : 'none',
    };
}
/**
 * Remove the auth hash from the URL without reloading, preserving the pathname
 * and query string. Safe to call even if no hash is present.
 */
export function stripSessionHash() {
    if (typeof window === 'undefined')
        return;
    const hash = window.location.hash;
    if (!hash || !hash.includes('access_token='))
        return;
    const { pathname, search } = window.location;
    window.history.replaceState(null, '', pathname + search);
}
/**
 * Alias retained for callers that want an explicit name.
 */
export const clearSessionHash = stripSessionHash;
//# sourceMappingURL=auth.js.map