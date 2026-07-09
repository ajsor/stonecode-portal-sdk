// Generates dist/theme.css (and refreshes src/theme.css) from the `tokens`
// object in src/theme.ts — the TS file is the single source of truth, so the
// two can no longer drift apart. Runs after tsc in `npm run build`.
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const { tokens } = await import(pathToFileURL(join(root, 'dist', 'theme.js')).href)

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const lines = []
lines.push('/* @stonecode/portal-sdk — shared design tokens')
lines.push(' * GENERATED from src/theme.ts by scripts/build-theme-css.mjs — do not edit by hand.')
lines.push(' * Import once at the root of your app:')
lines.push(' *   @import "@stonecode/portal-sdk/theme.css";')
lines.push(' */')
lines.push('')
lines.push(':root {')

const walk = (obj, prefix) => {
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}-${kebab(key)}`
    if (typeof value === 'object' && value !== null) walk(value, name)
    else lines.push(`  ${name}: ${value};`)
  }
}
// The `color` group is flattened (--sc-accent-500, not --sc-color-accent-500)
// to preserve the variable names consumers already reference.
walk(tokens.color, '--sc')
for (const [key, value] of Object.entries(tokens)) {
  if (key === 'color') continue
  walk(value, `--sc-${kebab(key)}`)
}

lines.push('}')
lines.push('')

const css = lines.join('\n')
mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist', 'theme.css'), css)
writeFileSync(join(root, 'src', 'theme.css'), css)
console.log('theme.css generated from theme.ts tokens')
