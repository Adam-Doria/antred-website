import { ColumnType, Generated } from 'kysely'

export interface Database {
  missing_persons: MissingPersonsTable
  missing_persons_article: MissingPersonsArticle
}

export interface BaseField {
  id: Generated<string>
  created_at: ColumnType<Date, string | undefined, never>
  updated_at: ColumnType<Date, string | undefined, string>
}

export interface MissingPersonsTable extends BaseField {
  firstName: string
  lastName: string
  gender: 'homme' | 'femme' | 'autre'
  birthdate: ColumnType<Date, string | undefined, string>
  disappearance_date: ColumnType<Date, string | undefined, string>
  disappearance_location: string | null | undefined
  country: string | null | undefined
  coordinates: { latitude: number; longitude: number }
  description: string | null
  images: string[]
}

export interface MissingPersonsArticle extends BaseField {
  tag: string
  title: string
  summary: string
  author: string
  publish_date: ColumnType<Date, string | undefined, string>
  content: string
  cover_image: string
  images: string[]
}
