import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const { neonMock, neonQueryMock } = vi.hoisted(() => {
  const queryMock = vi.fn(async () => [{ result: 1 }])

  return {
    neonMock: vi.fn(() => queryMock),
    neonQueryMock: queryMock,
  }
})

vi.mock('@neondatabase/serverless', () => ({
  neon: neonMock,
}))

// Import after mocking to ensure the mock is used
import { getNeonClient } from '../lib/db'

describe('Neon database configuration', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    process.env.DATABASE_URL = originalDatabaseUrl
  })

  it('throws when DATABASE_URL is not defined', () => {
    delete process.env.DATABASE_URL

    expect(() => getNeonClient()).toThrow(/DATABASE_URL/)
    expect(neonMock).not.toHaveBeenCalled()
  })

  it('returns a query client when DATABASE_URL is defined', async () => {
    process.env.DATABASE_URL =
      'postgresql://user:password@ep-host.neon.tech/dbname?sslmode=require'

    const client = getNeonClient()

    expect(typeof client).toBe('function')
    await client`SELECT 1`
    expect(neonMock).toHaveBeenCalledWith(
      'postgresql://user:password@ep-host.neon.tech/dbname?sslmode=require',
    )
    expect(neonQueryMock).toHaveBeenCalledOnce()
  })
})
