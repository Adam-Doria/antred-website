import { Database } from '@/lib/database/types'
import { Kysely, Transaction } from 'kysely'

type KyselyOrTransaction = Kysely<Database> | Transaction<Database>

export async function handleTags(
  dbOrTrx: KyselyOrTransaction,
  articleId: string,
  tagIds: string[] = []
) {
  console.log(`[handleTags] Deleting existing tags for article ${articleId}`)
  await dbOrTrx
    .deleteFrom('articleTags')
    .where('articleId', '=', articleId)
    .execute()
  console.log(`[handleTags] Existing tags deleted for article ${articleId}`)

  if (tagIds.length > 0) {
    console.log(
      `[handleTags] Inserting new tags for article ${articleId}:`,
      tagIds
    )
    const tagInserts = tagIds.map((tagId) => ({ articleId, tagId }))
    await dbOrTrx.insertInto('articleTags').values(tagInserts).execute()
    console.log(`[handleTags] New tags inserted for article ${articleId}`)
  } else {
    console.log(`[handleTags] No new tags to insert for article ${articleId}`)
  }
}
