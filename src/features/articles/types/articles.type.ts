// src/features/articles/types/articles.type.ts

import { UploadedImage } from '@/components/ui/image-uploader' // Assumant que ce type existe

export interface BaseEntity {
  id: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Category extends BaseEntity {
  name: string
  slug: string
  description: string | null
}
export type CategoryRO = Readonly<Category>
export type CategoryCreate = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
export type CategoryUpdate = Partial<CategoryCreate>

export interface Tag extends BaseEntity {
  name: string
  slug: string
  color: string
}
export type TagRO = Readonly<Tag>
export type TagCreate = Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>
export type TagUpdate = Partial<TagCreate>

export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface Article extends BaseEntity {
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImageUrl: string | null
  images: string[]
  categoryId: string | null
  category?: CategoryRO | null
  tags?: TagRO[]
  authorName: string | null
  status: ArticleStatus
  publishedAt: Date | string | null
}
export type ArticleRO = Readonly<Article>

export type ArticleCreate = Omit<
  Article,
  'id' | 'createdAt' | 'updatedAt' | 'category' | 'tags' | 'publishedAt'
> & {
  tagIds?: string[]
  uploadedCoverImage?: UploadedImage
  uploadedImages?: UploadedImage[]
}

export type ArticleUpdate = Partial<ArticleCreate>
