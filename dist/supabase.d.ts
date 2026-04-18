import { type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
export interface PortalSupabaseOptions {
    url: string;
    anonKey: string;
    /**
     * Optional storage key namespace. Satellites on a different subdomain
     * should use a unique key so tokens don't collide with stonecode.ai's.
     */
    storageKey?: string;
    /**
     * Passed through to supabase-js `auth` options.
     * Defaults: autoRefresh=true, persistSession=true, detectSessionInUrl=true.
     */
    authOverrides?: SupabaseClientOptions<'public'>['auth'];
}
/**
 * Canonical Supabase client factory shared by all portal apps. Guarantees
 * consistent auth defaults so session handoff between stonecode.ai and
 * satellites works predictably.
 */
export declare function createPortalSupabaseClient(opts: PortalSupabaseOptions): SupabaseClient;
//# sourceMappingURL=supabase.d.ts.map