'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleRO } from '@/features/articles/types/articles.type'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, UserIcon } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel'

interface ArticleTemplateProps {
  article: ArticleRO
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({ article }) => {
  if (!article) {
    return <div>Article non trouvé</div>
  }

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <article className="w-full">
      {article.coverImageUrl && (
        <div className="relative w-full aspect-[16/9] max-h-[450px] mb-12 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
          <Image
            src={article.coverImageUrl}
            alt={`Image de couverture: ${article.title}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      )}
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:underline">
          Accueil
        </Link>
        <span className="mx-2">/</span>
        <Link href="/conseils-pratiques" className="hover:underline">
          Conseils Pratiques
        </Link>
        <span className="mx-2">/</span>
        <span>{article.title}</span>
      </nav>

      <div className="flex justify-center gap-2 mb-6">
        {article.category && (
          <Link href={`/categories/${article.category.slug}`}>
            <Badge
              variant="outline"
              className="hover:bg-primary/10 transition-colors"
            >
              {article.category.name}
            </Badge>
          </Link>
        )}
        {article.tags &&
          article.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="hover:bg-primary/10 transition-colors"
              style={{ borderColor: tag.color, color: tag.color }}
            >
              {tag.name}
            </Badge>
          ))}
      </div>

      <header className="text-center mb-12 relative">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-center text-muted-foreground gap-5 text-sm">
          <div className="flex items-center">
            <UserIcon size={14} className="mr-1.5" />
            <span>{article.authorName || 'Antred'}</span>
          </div>
          {formattedDate && (
            <div className="flex items-center">
              <CalendarIcon size={14} className="mr-1.5" />
              <time dateTime={article.publishedAt?.toString()}>
                {formattedDate}
              </time>
            </div>
          )}
        </div>
      </header>

      <div className="article-content prose prose-lg dark:prose-invert max-w-none">
        {article.content?.introduction && (
          <section className="mb-10 text-lg font-medium leading-relaxed text-foreground/90">
            <div
              dangerouslySetInnerHTML={{
                __html: article.content.introduction
              }}
            />
          </section>
        )}

        {article.content?.part1 && (
          <section className="mb-10">
            <div dangerouslySetInnerHTML={{ __html: article.content.part1 }} />
          </section>
        )}

        {article.content?.quote && (
          <section className="my-12 px-6 py-4 border-l-4 border-primary/60 bg-primary/5 rounded-r-lg italic">
            <blockquote className="text-xl text-foreground/80 font-serif">
              <div
                dangerouslySetInnerHTML={{ __html: article.content.quote }}
              />
            </blockquote>
          </section>
        )}

        {article.content?.part2 && (
          <section className="mb-10">
            <div dangerouslySetInnerHTML={{ __html: article.content.part2 }} />
          </section>
        )}

        {article.content?.images && article.content.images.length > 0 && (
          <section className="my-12 w-full">
            <Carousel className="w-full max-w-full">
              <CarouselContent className="w-full pb-4">
                {article.content.images.map((imageUrl, index) => (
                  <CarouselItem
                    className="w-full h-[550px] overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ring-1 ring-black/5"
                    key={index}
                  >
                    <div className="relative w-full h-full flex items-center justify-center p-2">
                      <div className="relative w-full h-full max-w-full max-h-full]">
                        <Image
                          src={imageUrl}
                          alt={`Image ${index + 1} de l'article: ${article.title}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 1200px"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {article.content.images.length > 1 && (
                <>
                  <CarouselPrevious className="left-1" />
                  <CarouselNext className="right-1" />
                </>
              )}
            </Carousel>
          </section>
        )}

        {article.content?.part3 && (
          <section className="mb-10">
            <div dangerouslySetInnerHTML={{ __html: article.content.part3 }} />
          </section>
        )}
      </div>

      <footer className="mt-16 pt-8 border-t border-border/60 text-center text-muted-foreground">
        <p className="text-sm">
          Article publié par Antred, association d&apos;aide aux personnes
          disparues à l&apos;étranger.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link
            href="/conseils-pratiques"
            className="text-primary hover:text-primary/80 transition-colors text-sm"
          >
            Retour aux articles
          </Link>
          {article.category && (
            <Link
              href={`/categories/${article.category.slug}`}
              className="text-primary hover:text-primary/80 transition-colors text-sm"
            >
              Plus d&apos;articles dans {article.category.name}
            </Link>
          )}
        </div>
      </footer>
    </article>
  )
}

export default ArticleTemplate
