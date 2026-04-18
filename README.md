# @stonecode/portal-sdk

Shared building blocks for the stonecode.ai portal and its satellite apps
(aether, relaite, mb-dashboard, adam).

Canonical home for:

- Session hand-off between the portal and satellites (`bootstrapSessionFromHash`)
- Supabase client factory with consistent auth defaults
- Feature-flag fetching against the shared `feature_flags` / `user_feature_flags` tables
- Deep-link URL construction (`buildPortalLaunchUrl`)
- Design tokens (orange/amber palette, glass shadows, typography) in both TS and CSS form

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

```ts
import { buildPortalLaunchUrl } from '@stonecode/portal-sdk'

const url = buildPortalLaunchUrl('aether', session)
window.open(url, '_blank', 'noopener,noreferrer')
```

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
npm run build       # emits dist/
npm run typecheck
```

Commit and tag:

```bash
npm version patch
git push && git push --tags
```

Consumers then bump their `package.json` pin to the new ref.
