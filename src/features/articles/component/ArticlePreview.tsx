import React from 'react'
import { ArticleFormValues } from '../schema/articles.schema'
import ArticleTemplate from './ArticleTemplate'

interface ArticlePreviewProps {
  article: ArticleFormValues
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  return (
    <div>
      <ArticleTemplate article={article} />
    </div>
  )
}

export default ArticlePreview
