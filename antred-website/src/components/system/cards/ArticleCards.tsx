import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export interface ArticleCardsProps {
  id: string
  cover: {
    src: string
    alt: string
  }
  tag: string
  title: string
  summary: string
  author: string
  date: string
}

export default function ArticleCards(props: ArticleCardsProps) {
  return (
    <Card className="  flex flex-col overflow-hidden bg-transparent border-none shadow-none md:w-1/4  p-2">
      <CardHeader className="relative mb-2 h-56">
        <Image
          src={`${props?.cover?.src}`}
          alt={`${props?.cover?.alt}`}
          className="w-full h-auto rounded-lg"
          fill
          style={{
            objectFit: 'cover'
          }}
        />
        <Badge className="absolute top-4 right-4 bg-white/70 text-black">
          {props?.tag}
        </Badge>
      </CardHeader>
      <CardContent className="h-full flex-grow px-0 bg-transparent space-y-2 overflow-hidden">
        <div className="text-xl font-bold">{props?.title}</div>
        <p className=" text-sm  overflow-hidden text-ellipsis">
          {props?.summary}
        </p>
      </CardContent>
      <CardFooter className="text-xs px-0 pt-0 flex justify-between items-center">
        <div className=" text-foreground">
          By <span className="font-semibold">{props?.author}</span>
        </div>
        <div>{props?.date}</div>
        <Link
          href={`/conseils-pratiques/${props.id}/${props.title}`}
          className="inline-flex items-center font-bold hover:scale-110"
        >
          Lire plus
          <ArrowUpRight size="2rem" className="text-accent scale-105" />
        </Link>
      </CardFooter>
    </Card>
  )
}
