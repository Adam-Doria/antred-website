import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import { Database } from './types'
import { Pool } from 'pg'
import '../envConfig.ts'

let databaseInstance: Kysely<Database> | null = null

export function getDB(): Kysely<Database> {
  if (databaseInstance) return databaseInstance

  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL
    })
  })
  databaseInstance = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()]
  })

  return databaseInstance
}
