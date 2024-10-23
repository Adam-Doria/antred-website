import { cn } from '@/lib/utils'
import Marquee from '@/components/ui/marquee'
import Image from 'next/image'

const reviews = [
  {
    name: 'blabla',
    body: 'Sebastien Agrolard et son équipe se font un plaisir de vous accueillir du lundi au vendredi de 10h à 18h',
    img: 'forenseek.png',
    src: 'https://forenseek.fr'
  },
  {
    name: 'blabla',
    body: 'Association Unis pour Tiphaine',
    img: 'unispourtiphaine.png',
    src: 'https://avatar.vercel.sh/james'
  },
  {
    name: 'blabla',
    body: 'regreg',
    img: 'https://avatar.vercel.sh/john',
    src: 'https://avatar.vercel.sh/james'
  },
  {
    name: 'blabla',
    body: 'titre de de larticle de presse ',
    img: 'lesfrancais.webp',
    src: 'https://lesfrancais.press/unis-pour-tiphaine-et-lantred-pour-la-recherche-de-francais-disparus-a-letranger/'
  },
  {
    name: 'blabla',
    body: 'ergg',
    img: 'https://avatar.vercel.sh/jenny'
  },
  {
    name: 'blabla',
    body: 'ergeg',
    img: 'https://avatar.vercel.sh/james',
    src: 'https://avatar.vercel.sh/james'
  }
]

const Partner = reviews.slice(0, reviews.length / 2)
const press = reviews.slice(reviews.length / 2)
const ReviewCardDeux = ({
  img,
  src,
  body
}: {
  img: string
  name: string
  body: string
  src?: string
}) => {
  return (
    // <Image
    //   height={64}
    //   width={281}
    //   // objectFit="contain"
    //   src={`/images/presse/${img}`}
    //   alt={`logo de ${img}`}
    // />
    <a href={src}>
      <figure
        className={cn(
          'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 ',
          // light styles
          'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
          // dark styles
          'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
        )}
      >
        <div className="flex flex-col items-center justify-center h-[180px]">
          <Image
            height={32}
            width={281}
            src={`/images/presse/${img}`}
            alt={`logo de ${img}`}
          />
          <blockquote className="mt-2 text-sm">{body}</blockquote>
        </div>
      </figure>
    </a>
  )
}
const ReviewCard = ({
  img,
  src
}: {
  img: string
  name: string
  body: string
  src?: string
}) => {
  return (
    // <Image
    //   height={64}
    //   width={281}
    //   // objectFit="contain"
    //   src={`/images/presse/${img}`}
    //   alt={`logo de ${img}`}
    // />
    <a href={src}>
      <figure
        className={cn(
          'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 ',
          // light styles
          'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
          // dark styles
          'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
        )}
      >
        <div className="flex flex-col items-center justify-center h-[120px]">
          <Image
            height={32}
            width={281}
            src={`/images/presse/${img}`}
            alt={`logo de ${img}`}
          />
          {/* <blockquote className="mt-2 text-sm">{body}</blockquote> */}
        </div>
      </figure>
    </a>
  )
}

export function PressAndPartner() {
  return (
    <>
      <div className="relative flex h-[350px] w-full flex-col items-center justify-center overflow-hidden ">
        <Marquee pauseOnHover className="[--duration:40s]">
          {Partner.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {press.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
      <h1>ou </h1>
      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden pb-8">
        <Marquee pauseOnHover className="[--duration:40s]">
          {Partner.map((review) => (
            <ReviewCardDeux key={review.name} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {press.map((review) => (
            <ReviewCardDeux key={review.name} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </>
  )
}
