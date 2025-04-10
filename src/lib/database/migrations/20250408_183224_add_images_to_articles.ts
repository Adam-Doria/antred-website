/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('articles')
    .addColumn('images', sql`text[]`, (col) =>
      col.defaultTo(sql`'{}'::text[]`).notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('articles').dropColumn('images').execute()
}
