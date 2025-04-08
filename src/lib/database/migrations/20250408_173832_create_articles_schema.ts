/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('article_status_enum')
    .asEnum(['draft', 'published', 'archived'])
    .execute()

  //Catégories
  await db.schema
    .createTable('categories')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()

  //Tags
  await db.schema
    .createTable('tags')
    .ifNotExists()
    .addColumn('id', 'uuid', (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn('name', 'text', (col) => col.notNull().unique())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()

  //Articles
  await db.schema
    .createTable('articles')
    .addColumn('id', 'uuid', (col) =>
      col.defaultTo(sql`gen_random_uuid()`).primaryKey()
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('slug', 'text', (col) => col.notNull().unique())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('excerpt', 'text')
    .addColumn('coverImageUrl', 'text')
    .addColumn('categoryId', 'uuid', (col) =>
      col.references('categories.id').onDelete('set null')
    )
    .addColumn('authorName', 'text')
    .addColumn('status', sql`article_status_enum`, (col) =>
      col.defaultTo('draft').notNull()
    )
    .addColumn('publishedAt', 'timestamptz')
    .addColumn('createdAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updatedAt', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()

  await db.schema
    .createTable('articleTags')
    .ifNotExists()
    .addColumn('articleId', 'uuid', (col) =>
      col.references('articles.id').onDelete('cascade').notNull()
    )
    .addColumn('tagId', 'uuid', (col) =>
      col.references('tags.id').onDelete('cascade').notNull()
    )
    .addPrimaryKeyConstraint('articleTagsPkey', ['articleId', 'tagId'])
    .execute()

  await db.schema
    .createIndex('idxArticlesCategoryId')
    .on('articles')
    .column('categoryId')
    .execute()

  await db.schema
    .createIndex('idxArticleTagsArticleId')
    .on('articleTags')
    .column('articleId')
    .execute()

  await db.schema
    .createIndex('idxArticleTagsTagId')
    .on('articleTags')
    .column('tagId')
    .execute()

  await sql`
    CREATE OR REPLACE FUNCTION trigger_set_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db)

  const tablesForTrigger = ['categories', 'tags', 'articles']
  for (const tableName of tablesForTrigger) {
    await sql`
      DROP TRIGGER IF EXISTS set_timestamp ON ${sql.table(tableName)};
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON ${sql.table(tableName)}
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();
    `.execute(db)
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  const tablesForTrigger = ['categories', 'tags', 'articles']
  for (const tableName of tablesForTrigger) {
    await sql`DROP TRIGGER IF EXISTS set_timestamp ON ${sql.table(tableName)};`.execute(
      db
    )
  }

  await sql`DROP FUNCTION IF EXISTS trigger_set_timestamp();`.execute(db)

  await db.schema.dropIndex('idxArticlesCategoryId').ifExists().execute()
  await db.schema.dropIndex('idxArticleTagsArticleId').ifExists().execute()
  await db.schema.dropIndex('idxArticleTagsTagId').ifExists().execute()

  await db.schema.dropTable('articleTags').ifExists().execute()
  await db.schema.dropTable('articles').ifExists().execute()
  await db.schema.dropTable('tags').ifExists().execute()
  await db.schema.dropTable('categories').ifExists().execute()

  await db.schema.dropType('article_status_enum').ifExists().execute()
}
