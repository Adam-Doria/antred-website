import { ColumnType, Generated } from 'kysely'

export interface Database {
  missingPersons: MissingPersonsTable
  missingPersonArticles: MissingPersonsArticle
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

export interface MissingPersonsTable extends BaseField {
  firstName: string
  lastName: string
  gender: 'Masculin' | 'Féminin' | 'Autre'
  birthDate: Date | undefined | string
  disappearanceDate: Date | undefined | string
  disappearanceLocation: string | null | undefined
  country: string | null | undefined
  coordinates: {
    latitude: number
    longitude: number
  }
  description: string | null
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
