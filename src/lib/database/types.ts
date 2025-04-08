import { ColumnType, Generated } from 'kysely'

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
  createdAt: ColumnType<
    Date | undefined | string,
    Date | undefined | string,
    never
  >
  updatedAt: Date | undefined | string
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
  slug: string
}

export interface ArticlesTable extends BaseField {
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImageUrl: string | null
  categoryId: string | null
  authorName: string | null
  status: 'draft' | 'published' | 'archived'
  publishedAt: ColumnType<
    Date | string | null,
    string | undefined,
    string | undefined
  >
}

export interface ArticleTagsTable {
  articleId: string
  tagId: string
}
