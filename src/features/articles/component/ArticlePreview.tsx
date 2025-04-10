import React from 'react'
import ArticleTemplate from './ArticleTemplate'
import { ArticleRO } from '../types/articles.type'

interface ArticlePreviewProps {
  article: ArticleRO
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  return (
    <div>
      <ArticleTemplate article={article} />
    </div>
  )
}

export default ArticlePreview
