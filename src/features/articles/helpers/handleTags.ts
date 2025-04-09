import { Database } from '@/lib/database/types'
import { Kysely } from 'kysely'

export async function handleTags(
  db: Kysely<Database>,
  articleId: string,
  tagIds: string[] = []
) {
  await db
    .deleteFrom('articleTags')
    .where('articleId', '=', articleId)
    .execute()
  if (tagIds.length > 0) {
    const tagInserts = tagIds.map((tagId) => ({ articleId, tagId }))
    await db.insertInto('articleTags').values(tagInserts).execute()
  }
}
