/**
 * Exchange the current session for a one-time handoff code.
 * Requires a signed-in Supabase client (the edge function verifies the
 * caller's JWT and that the tokens being stored belong to that caller).
 */
export async function createSessionHandoff(supabase, session) {
    const { data, error } = await supabase.functions.invoke('portal-handoff', {
        body: {
            op: 'create',
            access_token: session.access_token,
            refresh_token: session.refresh_token,
        },
    });
    if (error)
        return { code: null, error: error.message };
    if (!data?.code)
        return { code: null, error: 'No code returned' };
    return { code: data.code };
}
/**
 * Redeem a handoff code for the session tokens it references.
 * Used internally by `bootstrapSessionFromHash`; exported for satellites
 * with custom bootstrap flows.
 */
export async function redeemSessionHandoff(supabase, code) {
    const { data, error } = await supabase.functions.invoke('portal-handoff', {
        body: { op: 'redeem', code },
    });
    if (error)
        return { error: error.message };
    if (!data?.access_token || !data?.refresh_token) {
        return { error: 'Handoff code invalid or expired' };
    }
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
    };
}
//# sourceMappingURL=handoff.js.map