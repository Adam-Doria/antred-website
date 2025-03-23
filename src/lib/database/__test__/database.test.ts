/* eslint-disable @typescript-eslint/no-var-requires */
import { describe, it, expect, vi } from 'vitest'

vi.mock('pg', () => {
  const mockPool = {
    query: vi.fn(),
    end: vi.fn
  }
  return { Pool: vi.fn(() => mockPool) }
})

import { getDB } from '../db'
import { beforeEach } from 'node:test'

describe('Database client', () => {
  beforeEach(() => vi.clearAllMocks())

  it('should return a database instance', () => {
    const db = getDB()
    expect(db).toBeDefined()
  })

  it('should reuse the same instance when called multiple times', () => {
    const db1 = getDB()
    const db2 = getDB()
    expect(db1).toBe(db2)
  })
})
