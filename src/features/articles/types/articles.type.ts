import { ArticlesTable, CategoriesTable, TagsTable } from '@/lib/database/types'

export type Category = CategoriesTable
export type Tag = TagsTable
export type Article = ArticlesTable & {
  category?: Category
  tags?: Tag[]
}

export type ArticleRO = Readonly<Article>

export type ArticleCreate = Omit<
  Article,
  'id' | 'createdAt' | 'updatedAt' | 'category' | 'tags'
> & {
  tags?: string[]
}
export type ArticleUpdate = Partial<ArticleCreate>
