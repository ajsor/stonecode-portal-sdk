import { describe, it, expect } from 'vitest'
import {
  buildPortalLaunchUrl,
  buildPortalHandoffUrl,
  SATELLITE_URLS,
} from '../src/portal.js'

const session = { access_token: 'at-123', refresh_token: 'rt-456' }

describe('buildPortalLaunchUrl', () => {
  it('resolves known satellite keys to their URLs', () => {
    const url = buildPortalLaunchUrl('aether', session)
    expect(url.startsWith('https://aether.stonecode.ai/#')).toBe(true)
  })

  it('passes raw URLs through for unknown apps', () => {
    const url = buildPortalLaunchUrl('https://example.stonecode.ai', session)
    expect(url.startsWith('https://example.stonecode.ai/#')).toBe(true)
  })

  it('encodes both tokens and the portal type marker in the hash', () => {
    const url = buildPortalLaunchUrl('relaite', session, '/dashboard')
    const hash = new URLSearchParams(url.split('#')[1])
    expect(hash.get('access_token')).toBe('at-123')
    expect(hash.get('refresh_token')).toBe('rt-456')
    expect(hash.get('type')).toBe('portal')
    expect(url).toContain('/dashboard#')
  })

  it('normalizes paths missing a leading slash', () => {
    const url = buildPortalLaunchUrl('adam', session, 'settings')
    expect(url).toContain('https://adam.stonecode.ai/settings#')
  })
})

describe('buildPortalHandoffUrl', () => {
  it('carries only the handoff code — never tokens', () => {
    const url = buildPortalHandoffUrl('joule', 'code-789')
    const hash = new URLSearchParams(url.split('#')[1])
    expect(hash.get('handoff_code')).toBe('code-789')
    expect(hash.get('type')).toBe('portal')
    expect(url).not.toContain('access_token')
    expect(url).not.toContain('refresh_token')
  })
})

describe('SATELLITE_URLS', () => {
  it('covers every satellite the portal launches', () => {
    expect(Object.keys(SATELLITE_URLS).sort()).toEqual(
      [
        'adam', 'aether', 'cameo', 'chorus', 'forge', 'joule', 'lens',
        'mb-dashboard', 'mosaic', 'recon', 'relaite', 'sketchy',
      ].sort(),
    )
  })
})
