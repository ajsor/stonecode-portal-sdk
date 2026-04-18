import type { Session } from '@supabase/supabase-js';
export declare const PORTAL_URL = "https://stonecode.ai";
export type SatelliteApp = 'aether' | 'relaite' | 'mb-dashboard' | 'adam';
export declare const SATELLITE_URLS: Record<SatelliteApp, string>;
/**
 * Build a deep-link URL that opens a satellite app with the caller's Supabase
 * session attached as a URL hash. The satellite consumes this via
 * `bootstrapSessionFromHash` and strips the hash from the address bar.
 *
 * Tokens in the hash stay out of referers/server logs but are visible in
 * browser history. Treat the hand-off as a short window; the satellite should
 * scrub it immediately on load.
 */
export declare function buildPortalLaunchUrl(app: SatelliteApp | string, session: Pick<Session, 'access_token' | 'refresh_token'>, path?: string): string;
//# sourceMappingURL=portal.d.ts.map