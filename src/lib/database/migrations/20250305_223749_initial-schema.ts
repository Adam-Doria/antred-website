import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createType('gender_type')
    .asEnum(['Masculin', 'Féminin', 'Autre'])
    .execute()

  await db.schema
    .createTable('missingPersons')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn('firstName', 'text', (col) => col.notNull())
    .addColumn('lastName', 'text', (col) => col.notNull())
    .addColumn('gender', sql`gender_type`)
    .addColumn('country', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('birthDate', 'date')
    .addColumn('disappearanceDate', 'date', (col) => col.notNull())
    .addColumn('disappearanceLocation', 'text', (col) => col.notNull())
    .addColumn('coordinates', 'jsonb')
    .addColumn('images', sql`text[]`, (col) =>
      col.notNull().defaultTo(sql`'{}'`)
    )
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addUniqueConstraint('firstNameLastNameUnique', ['firstName', 'lastName'])
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('missingPersons').ifExists().execute()
  await db.schema.dropType('gender_type').ifExists().execute()
}
