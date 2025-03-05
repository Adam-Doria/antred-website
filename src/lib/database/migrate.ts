/* eslint-disable indent */
import * as path from 'path'
import { promises as fs } from 'fs'
import { getDB } from './db'
import { Migrator, FileMigrationProvider, MigrationResult } from 'kysely'

type MigrationInstructions = 'up' | 'down' | 'latest' | 'init'

const migrationTemplate = `
import {Kysely} from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {

}

export async function down(db: Kysely<unknown>): Promise<void> {

}`

const migrationFolder = './src/lib/database/migrations'

const instruction = process.argv[2] as MigrationInstructions | undefined

if (!instruction) {
  console.error(
    `Need instructions to execute, please enter one of the following 'up', 'down', 'latest' or 'init'`
  )
  console.error('Exemple : pnpm migrate new add-missing-person-table')
  process.exit(1)
}

async function createNewMigration() {
  const migrationName = process.argv[3]
  if (!migrationName) {
    console.error('Error: a name is required to create a new migration')
    console.error('Exemple: pnpm migrate new add-status-column')
    process.exit(1)
  }

  const now = new Date()
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '_',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0')
  ].join('')

  const fileName = `${timestamp}_${migrationName}.ts`
  const filePath = path.join(migrationFolder, fileName)

  try {
    await fs.access(migrationFolder)
  } catch (error) {
    await fs.mkdir(migrationFolder, { recursive: true })
  }

  await fs.writeFile(filePath, migrationTemplate)

  console.log(`Migration : Succesfully create  '${fileName}' `)
}

async function migrate() {
  console.log('Start Migration')

  const database = getDB()

  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      migrationFolder,
      path
    })
  })

  try {
    let error: unknown | undefined
    let results: MigrationResult[] | undefined

    switch (instruction) {
      case 'up':
        ;({ results, error } = await migrator.migrateUp())
        break

      case 'down':
        ;({ results, error } = await migrator.migrateDown())
      case 'latest':
      default:
        ;({ results, error } = await migrator.migrateToLatest())
        break
    }

    results?.forEach((migration) => {
      if (migration.status === 'Success' && migration.direction === `Up`) {
        console.log(
          `${new Date().toISOString()} - migration "${migration.migrationName}" was executed successfully`
        )
      } else if (
        migration.status === 'Success' &&
        migration.direction === `Down`
      ) {
        console.log(
          `${new Date().toISOString()} - migration "${migration.migrationName}" was reverted successfully`
        )
      } else if (migration.status === 'Error') {
        console.error(
          `${new Date().toISOString()} - failed to execute migration "${migration.migrationName}"`
        )
      }
    })
    if (results?.length === 0 && instruction !== 'down') {
      console.log(`${new Date().toISOString()} - Migrations are up to date`)
    } else if (results?.length === 0 && instruction === 'down') {
      console.log(
        `${new Date().toISOString()} - No migration to rollback: database is in its initial state`
      )
    }

    if (error) {
      console.error(`${new Date().toISOString()} - failed to migrate`)
      console.error(error)
      process.exit(1)
    }
  } catch (error) {
    console.error(' Unespected Error during migration:')
    console.error(error)
    process.exit(1)
  } finally {
    await database.destroy()
    console.log('Database connexion close - End of Migration')
  }
}

;(async () => {
  switch (instruction) {
    case 'init': {
      await createNewMigration()
      break
    }
    default: {
      await migrate()
      break
    }
  }
})()
