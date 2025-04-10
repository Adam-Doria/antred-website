/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('tags')
    .addColumn('color', 'varchar(7)', (col) => col.defaultTo('#cccccc'))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('tags').dropColumn('color').execute()
}
