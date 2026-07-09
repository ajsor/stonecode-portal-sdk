import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import { bootstrapSessionFromHash, stripSessionHash } from '../src/auth.js'

function makeSupabaseStub(overrides: Record<string, unknown> = {}) {
  return {
    auth: {
      setSession: vi.fn(async (tokens: { access_token: string }) => ({
        data: { session: { access_token: tokens.access_token } },
        error: null,
      })),
      getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
      ...(overrides.auth as object ?? {}),
    },
    functions: {
      invoke: vi.fn(async () => ({
        data: { access_token: 'redeemed-at', refresh_token: 'redeemed-rt' },
        error: null,
      })),
      ...(overrides.functions as object ?? {}),
    },
  } as unknown as SupabaseClient
}

function setHash(hash: string) {
  window.history.replaceState(null, '', `/app?q=1${hash}`)
}

beforeEach(() => {
  window.history.replaceState(null, '', '/app?q=1')
})

describe('bootstrapSessionFromHash — legacy token hash', () => {
  it('installs the session and scrubs the hash', async () => {
    setHash('#access_token=at&refresh_token=rt&type=portal')
    const supabase = makeSupabaseStub()
    const result = await bootstrapSessionFromHash(supabase)
    expect(result.source).toBe('hash')
    expect(supabase.auth.setSession).toHaveBeenCalledWith({
      access_token: 'at',
      refresh_token: 'rt',
    })
    expect(window.location.hash).toBe('')
    expect(window.location.search).toBe('?q=1')
  })

  it('scrubs the hash even when refresh_token is missing (regression)', async () => {
    setHash('#access_token=at-only&type=portal')
    const supabase = makeSupabaseStub()
    const result = await bootstrapSessionFromHash(supabase)
    expect(window.location.hash).toBe('')
    // falls through to existing-session lookup
    expect(result.source).toBe('none')
  })
})

describe('bootstrapSessionFromHash — handoff code', () => {
  it('redeems the code, installs the session, and scrubs the hash', async () => {
    setHash('#handoff_code=one-time-code&type=portal')
    const supabase = makeSupabaseStub()
    const result = await bootstrapSessionFromHash(supabase)
    expect(result.source).toBe('handoff')
    expect(result.error).toBeUndefined()
    expect(supabase.functions.invoke).toHaveBeenCalledWith('portal-handoff', {
      body: { op: 'redeem', code: 'one-time-code' },
    })
    expect(supabase.auth.setSession).toHaveBeenCalledWith({
      access_token: 'redeemed-at',
      refresh_token: 'redeemed-rt',
    })
    expect(window.location.hash).toBe('')
  })

  it('surfaces redemption failures without crashing', async () => {
    setHash('#handoff_code=expired-code&type=portal')
    const supabase = makeSupabaseStub({
      functions: {
        invoke: vi.fn(async () => ({ data: null, error: { message: 'expired' } })),
      },
    })
    const result = await bootstrapSessionFromHash(supabase)
    expect(result.source).toBe('handoff')
    expect(result.session).toBeNull()
    expect(result.error).toBeTruthy()
    expect(window.location.hash).toBe('')
  })
})

describe('bootstrapSessionFromHash — no hash', () => {
  it('falls back to the existing session', async () => {
    const supabase = makeSupabaseStub({
      auth: {
        getSession: vi.fn(async () => ({
          data: { session: { access_token: 'persisted' } },
          error: null,
        })),
      },
    })
    const result = await bootstrapSessionFromHash(supabase)
    expect(result.source).toBe('existing')
  })
})

describe('stripSessionHash', () => {
  it('leaves unrelated hashes alone', () => {
    setHash('#section-2')
    stripSessionHash()
    expect(window.location.hash).toBe('#section-2')
  })
})
