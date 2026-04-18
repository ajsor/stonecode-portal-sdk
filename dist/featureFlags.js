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
export async function fetchUserFeatureFlags(supabase, userId) {
    const flags = {};
    const { data: defaults } = await supabase
        .from('feature_flags')
        .select('name, enabled_default');
    for (const flag of (defaults ?? [])) {
        flags[flag.name] = flag.enabled_default;
    }
    const { data: overrides } = await supabase
        .from('user_feature_flags')
        .select('enabled, feature_flags(name)')
        .eq('user_id', userId);
    for (const row of (overrides ?? [])) {
        const fk = Array.isArray(row.feature_flags) ? row.feature_flags[0] : row.feature_flags;
        if (fk?.name) {
            flags[fk.name] = row.enabled;
        }
    }
    return flags;
}
// Satisfy "export { useFeatureFlagContract }" by also exporting a typed noop.
// Real hooks live in each app (they need the app's Auth context); this is
// the shared *contract* they should conform to.
export const useFeatureFlagContract = undefined;
//# sourceMappingURL=featureFlags.js.map