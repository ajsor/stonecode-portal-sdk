export const PORTAL_URL = 'https://stonecode.ai';
export const SATELLITE_URLS = {
    aether: 'https://aether.stonecode.ai',
    relaite: 'https://relaite.stonecode.ai',
    'mb-dashboard': 'https://mb-dashboard.stonecode.ai',
    adam: 'https://adam.stonecode.ai',
    chorus: 'https://chorus.stonecode.ai',
    mosaic: 'https://mosaic.stonecode.ai',
    recon: 'https://recon.stonecode.ai',
    lens: 'https://lens.stonecode.ai',
    sketchy: 'https://sketchy.stonecode.ai',
    forge: 'https://forge.stonecode.ai',
    cameo: 'https://cameo.stonecode.ai',
    joule: 'https://joule.stonecode.ai',
};
/**
 * Build a deep-link URL that opens a satellite app with the caller's Supabase
 * session attached as a URL hash. The satellite consumes this via
 * `bootstrapSessionFromHash` and strips the hash from the address bar.
 *
 * LEGACY: raw tokens in the hash are visible in the new tab's browser history
 * until scrubbed, and the refresh token is long-lived. Prefer
 * `buildPortalHandoffUrl` (one-time code) once the satellite runs SDK >= 0.2.0.
 */
export function buildPortalLaunchUrl(app, session, path = '/') {
    const hashParams = new URLSearchParams({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        type: 'portal',
    });
    return buildSatelliteUrl(app, path, hashParams);
}
/**
 * Build a deep-link URL that opens a satellite app with a one-time handoff
 * code (from `createSessionHandoff`) instead of raw tokens. The satellite's
 * `bootstrapSessionFromHash` (SDK >= 0.2.0) redeems it on load.
 */
export function buildPortalHandoffUrl(app, handoffCode, path = '/') {
    const hashParams = new URLSearchParams({
        handoff_code: handoffCode,
        type: 'portal',
    });
    return buildSatelliteUrl(app, path, hashParams);
}
function buildSatelliteUrl(app, path, hashParams) {
    const base = isSatelliteKey(app) ? SATELLITE_URLS[app] : app;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}#${hashParams.toString()}`;
}
function isSatelliteKey(value) {
    return value in SATELLITE_URLS;
}
//# sourceMappingURL=portal.js.map