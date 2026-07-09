# @stonecode/portal-sdk

Shared building blocks for the stonecode.ai portal and its satellite apps
(aether, relaite, mb-dashboard, adam, chorus, mosaic, recon, lens, sketchy,
forge, cameo, joule).

Canonical home for:

- Session hand-off between the portal and satellites (`bootstrapSessionFromHash`)
- One-time handoff codes (`createSessionHandoff` / `buildPortalHandoffUrl`) —
  keeps tokens out of launch URLs entirely
- Supabase client factory with consistent auth defaults
- Feature-flag fetching against the shared `feature_flags` / `user_feature_flags` tables
- Deep-link URL construction (`buildPortalLaunchUrl`)
- Design tokens (orange/amber palette, glass shadows, typography) in both TS and CSS form
  — `theme.css` is generated from `theme.ts` at build time

## Install

Consumed via git URL so no npm registry is required:

```bash
npm install github:ajsor/stonecode-portal-sdk
```

Or pin to a tag/commit:

```json
{
  "dependencies": {
    "@stonecode/portal-sdk": "github:ajsor/stonecode-portal-sdk#v0.1.0"
  }
}
```

`dist/` is committed to this repo on purpose so consumers don't need a build step.

## Usage

### Auth bootstrap (satellite app)

```ts
import { createPortalSupabaseClient, bootstrapSessionFromHash } from '@stonecode/portal-sdk'

const supabase = createPortalSupabaseClient({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  storageKey: 'aether-auth', // unique per satellite
})

// Call before your router mounts
const { session, source, error } = await bootstrapSessionFromHash(supabase)
```

### Deep-link from portal to satellite

Preferred (SDK >= 0.2.0 on the satellite; requires the `portal-handoff` edge
function): a single-use, 120-second code instead of raw tokens in the URL —

```ts
import { createSessionHandoff, buildPortalHandoffUrl } from '@stonecode/portal-sdk'

const { code } = await createSessionHandoff(supabase, session)
const url = buildPortalHandoffUrl('aether', code)
window.open(url, '_blank', 'noopener,noreferrer')
```

Legacy (works with any SDK version, but puts the refresh token in the new
tab's browser history):

```ts
import { buildPortalLaunchUrl } from '@stonecode/portal-sdk'

const url = buildPortalLaunchUrl('aether', session)
window.open(url, '_blank', 'noopener,noreferrer')
```

`bootstrapSessionFromHash` on the satellite side understands both hash
formats, so satellites can upgrade to 0.2.0 before the portal flips over.

### Theme

```css
/* In your root CSS */
@import '@stonecode/portal-sdk/theme.css';
```

```ts
import { tokens } from '@stonecode/portal-sdk'

<div style={{ color: tokens.color.accent[400] }} />
```

## Development

```bash
npm install
npm run build       # emits dist/ (tsc + theme.css codegen)
npm run typecheck
npm test            # vitest — hash bootstrap + URL builder coverage
```

Commit and tag:

```bash
npm version patch
git push && git push --tags
```

Consumers then bump their `package.json` pin to the new ref.
