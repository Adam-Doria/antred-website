/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from 'kysely'
export async function up(db: Kysely<any>): Promise<void> {
  try {
    await db.schema.alterTable('articles').dropColumn('content').execute()
    console.log(`Dropped existing 'content' text column.`)
  } catch (error: any) {
    if (error.code !== '42703') {
      throw error
    }
    console.log(`'content' text column did not exist, skipping drop.`)
  }

  try {
    await db.schema.alterTable('articles').dropColumn('images').execute()
    console.log(`Dropped existing 'images' text[] column.`)
  } catch (error: any) {
    if (error.code !== '42703') {
      throw error
    }
    console.log(`'images' text[] column did not exist, skipping drop.`)
  }

  await db.schema
    .alterTable('articles')
    .addColumn('content', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'{}'::jsonb`)
    )
    .execute()
  console.log(`Added new 'content' jsonb column.`)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('articles').dropColumn('content').execute()
  console.log(`Dropped 'content' jsonb column.`)

  await db.schema
    .alterTable('articles')
    .addColumn('images', sql`text[]`, (col) =>
      col.notNull().defaultTo(sql`'{}'::text[]`)
    )
    .execute()
  console.log(`Re-created 'images' text[] column.`)

  await db.schema
    .alterTable('articles')
    .addColumn('content', 'text', (col) => col.notNull().defaultTo(''))
    .execute()
  console.log(`Re-created 'content' text column.`)
}
