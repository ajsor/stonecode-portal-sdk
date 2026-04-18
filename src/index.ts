export {
  bootstrapSessionFromHash,
  clearSessionHash,
  stripSessionHash,
  type BootstrapResult,
} from './auth.js'

export {
  fetchUserFeatureFlags,
  useFeatureFlagContract,
  type FeatureFlagMap,
} from './featureFlags.js'

export {
  buildPortalLaunchUrl,
  PORTAL_URL,
  SATELLITE_URLS,
  type SatelliteApp,
} from './portal.js'

export {
  theme,
  tokens,
  type ThemeTokens,
} from './theme.js'

export {
  createPortalSupabaseClient,
  type PortalSupabaseOptions,
} from './supabase.js'

export { SDK_VERSION } from './version.js'
