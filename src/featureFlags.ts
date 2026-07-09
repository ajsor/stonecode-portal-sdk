import type { SupabaseClient } from '@supabase/supabase-js'

export type FeatureFlagMap = Record<string, boolean>

/**
 * Merge global default feature flags with the user's per-user overrides.
 *
 * Reads from:
 *   - `feature_flags` (name, enabled_default)
 *   - `user_feature_flags` (user_id, feature_id, enabled) joined to feature_flags
 *
 * Returns a simple `{ [name]: boolean }` map. Unknown flags resolve to false
 * via the contract helper below.
 */
export async function fetchUserFeatureFlags(
  supabase: SupabaseClient,
  userId: string
): Promise<FeatureFlagMap> {
  const flags: FeatureFlagMap = {}

  const { data: defaults } = await supabase
    .from('feature_flags')
    .select('name, enabled_default')

  for (const flag of (defaults ?? []) as Array<{
    name: string
    enabled_default: boolean
  }>) {
    flags[flag.name] = flag.enabled_default
  }

  const { data: overrides } = await supabase
    .from('user_feature_flags')
    .select('enabled, feature_flags(name)')
    .eq('user_id', userId)

  for (const row of (overrides ?? []) as unknown as Array<{
    enabled: boolean
    feature_flags: { name: string } | { name: string }[] | null
  }>) {
    const fk = Array.isArray(row.feature_flags) ? row.feature_flags[0] : row.feature_flags
    if (fk?.name) {
      flags[fk.name] = row.enabled
    }
  }

  return flags
}

/**
 * Shape-only contract so consumers can type a `useFeatureFlags` hook
 * consistently across apps without all of them re-declaring the interface.
 * Type-only on purpose: real hooks live in each app (they need the app's
 * Auth context). The previous runtime `undefined` binding looked callable
 * and shipped a trap in the bundle.
 */
export interface UseFeatureFlagsContract {
  flags: FeatureFlagMap
  hasFeature: (name: string) => boolean
  isLoading: boolean
}

/** @deprecated Use {@link UseFeatureFlagsContract}. */
export type useFeatureFlagContract = UseFeatureFlagsContract
