import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArticleRO } from '@/features/articles/types/articles.type'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ArticleCardsProps {
  article: ArticleRO
  className?: string
}

export const ArticleCard: React.FC<ArticleCardsProps> = ({
  article,
  className
}) => {
  const tagName =
    article.tags && article.tags.length > 0 ? article.tags[0].name : 'Article'
  const articleLink = `/conseils-pratiques/${article.slug}`
  const coverSrc = article.coverImageUrl || '/images/presse/default.jpeg'

  return (
    <Link
      href={articleLink}
      aria-label={`Lire l'article "${article.title}"`}
      className="group"
    >
      <Card
        className={cn(
          'group flex flex-col overflow-hidden bg-transparent border-none shadow-none w-full p-2 transition-transform hover:scale-105',
          className
        )}
      >
        <CardHeader className="relative mb-2 h-56">
          <Image
            src={coverSrc}
            alt={`${article?.coverImageUrl ? `Couverture de l'article ${article.title}` : 'Image par défaut pour article'}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-gray-50 border-secondary-foreground text-secondary-foreground">
              {tagName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="h-full flex-grow px-0 bg-transparent space-y-2 overflow-hidden">
          <div className="text-xl font-bold">{article.title}</div>
          <p className=" text-sm  overflow-hidden text-ellipsis">
            {article.excerpt || 'Pas de résumé pour cet article.'}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center p-2">
          <div className="text-xs text-muted-foreground">
            Par {article.authorName || 'Antred'}
          </div>
          <div className="inline-flex items-center font-bold hover:scale-110 text-accent">
            Lire <ArrowUpRight size="1rem" className=" scale-105 ml-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default ArticleCard
