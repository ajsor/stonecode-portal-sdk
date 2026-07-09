import type { Session } from '@supabase/supabase-js';
export declare const PORTAL_URL = "https://stonecode.ai";
export type SatelliteApp = 'aether' | 'relaite' | 'mb-dashboard' | 'adam' | 'chorus' | 'mosaic' | 'recon' | 'lens' | 'sketchy' | 'forge' | 'cameo' | 'joule';
export declare const SATELLITE_URLS: Record<SatelliteApp, string>;
/**
 * Build a deep-link URL that opens a satellite app with the caller's Supabase
 * session attached as a URL hash. The satellite consumes this via
 * `bootstrapSessionFromHash` and strips the hash from the address bar.
 *
 * LEGACY: raw tokens in the hash are visible in the new tab's browser history
 * until scrubbed, and the refresh token is long-lived. Prefer
 * `buildPortalHandoffUrl` (one-time code) once the satellite runs SDK >= 0.2.0.
 */
export declare function buildPortalLaunchUrl(app: SatelliteApp | string, session: Pick<Session, 'access_token' | 'refresh_token'>, path?: string): string;
/**
 * Build a deep-link URL that opens a satellite app with a one-time handoff
 * code (from `createSessionHandoff`) instead of raw tokens. The satellite's
 * `bootstrapSessionFromHash` (SDK >= 0.2.0) redeems it on load.
 */
export declare function buildPortalHandoffUrl(app: SatelliteApp | string, handoffCode: string, path?: string): string;
//# sourceMappingURL=portal.d.ts.map