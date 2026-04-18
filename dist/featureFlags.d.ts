import type { SupabaseClient } from '@supabase/supabase-js';
export type FeatureFlagMap = Record<string, boolean>;
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
export declare function fetchUserFeatureFlags(supabase: SupabaseClient, userId: string): Promise<FeatureFlagMap>;
/**
 * Shape-only helper so consumers can type a `useFeatureFlags` hook
 * consistently across apps without all of them re-declaring the interface.
 */
export interface useFeatureFlagContract {
    flags: FeatureFlagMap;
    hasFeature: (name: string) => boolean;
    isLoading: boolean;
}
export declare const useFeatureFlagContract: useFeatureFlagContract;
//# sourceMappingURL=featureFlags.d.ts.map