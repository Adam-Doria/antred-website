import { ColumnType, Generated, JSONColumnType } from 'kysely'

export interface Database {
  missingPersons: MissingPersonsTable
  missingPersonArticles: MissingPersonsArticle
  categories: CategoriesTable
  tags: TagsTable
  articles: ArticlesTable
  articleTags: ArticleTagsTable
}

export interface BaseField {
  id: Generated<string>
  createdAt: ColumnType<Date | string, undefined, never>
  updatedAt: ColumnType<Date | string, undefined, undefined>
}

//*************************/
//** PERSONNES DISPARUES */
//***********************/
export interface MissingPersonsTable extends BaseField {
  firstName: string
  lastName: string
  gender: 'Masculin' | 'Féminin' | 'Autre'
  birthDate: Date | undefined | string
  disappearanceDate: Date | undefined | string
  disappearanceLocation: string | undefined
  country: string | undefined
  coordinates: {
    latitude: number
    longitude: number
  }
  description: string | undefined
  images: string[]
}

export interface MissingPersonsArticle extends BaseField {
  tag: string
  title: string
  summary: string
  author: string
  publishDate: Date | undefined | string
  content: string
  coverImage: string
  images: string[]
}

//*************************/
//** ARTICLES*************/
//***********************/
export interface CategoriesTable extends BaseField {
  name: string
  slug: string
  description: string | null
}

export interface TagsTable extends BaseField {
  name: string
  color: string
  slug: string
}

export interface ArticleContentStructure {
  introduction?: string | null
  part1?: string
  quote?: string | null
  part2?: string | null
  images?: string[] | null
  part3?: string | null
}
export interface ArticlesTable extends BaseField {
  title: string
  slug: string
  excerpt: string | null
  coverImageUrl: string | null
  categoryId: string | null
  authorName: string | null
  status: 'draft' | 'published' | 'archived'
  publishedAt: ColumnType<
    Date | string | null,
    Date | string | null | undefined,
    Date | string | null | undefined
  >
  content: JSONColumnType<ArticleContentStructure>
}

export interface ArticleTagsTable {
  articleId: string
  tagId: string
}
