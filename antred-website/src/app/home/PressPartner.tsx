import { cn } from '@/lib/utils'
import Marquee from '@/components/ui/marquee'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const reviews = [
  {
    name: 'forenseek',
    body: `A travers Forenseek, Sébastien Aguilar nous apporte son soutien et son oeil d\'expert de la Police Scientifique.`,
    img: 'forenseek.png',
    src: 'https://forenseek.fr'
  },
  {
    name: 'blabla',
    body: 'Association Unis pour Tiphaine',
    img: 'unispourtiphaine.png',
    src: 'https://unispourtiphaine.org/'
  },
  {
    name: 'blabla',
    body: 'Ensemble pour retrouver Mathieu',
    img: 'ensemblepourmathieu.png',
    src: 'https://www.ensemblepourretrouvermathieu.com/fr/'
  },
  {
    name: 'press1',
    body: 'Unis pour Tiphaine et l’ANTRED pour la recherche de Français disparus à l’étranger ',
    img: 'lesfrancais.webp',
    src: 'https://lesfrancais.press/unis-pour-tiphaine-et-lantred-pour-la-recherche-de-francais-disparus-a-letranger/'
  },
  {
    name: 'press2',
    body: 'Unis pour Tiphaine et l’ANTRED pour la recherche de Français disparus à l’étranger ',
    img: 'lesfrancais.webp',
    src: 'https://lesfrancais.press/unis-pour-tiphaine-et-lantred-pour-la-recherche-de-francais-disparus-a-letranger/'
  },
  {
    name: 'press3',
    body: 'Unis pour Tiphaine et l’ANTRED pour la recherche de Français disparus à l’étranger ',
    img: 'lesfrancais.webp',
    src: 'https://lesfrancais.press/unis-pour-tiphaine-et-lantred-pour-la-recherche-de-francais-disparus-a-letranger/'
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
          <blockquote className="m-2 text-sm text-pretty">{body}</blockquote>
        </div>
      </figure>
    </a>
  )
}

export function PressAndPartner() {
  const t = useTranslations('homepage.pressAndPartner')
  return (
    <>
      <h2 className="mt-4"> {t('partnerTitle')} </h2>
      <h4> {t('partnerSubtitle')}</h4>
      <div className="relative flex h-[250] w-full flex-col items-center justify-center overflow-hidden my-8">
        <Marquee pauseOnHover className="[--duration:40s]">
          {Partner.map((review) => (
            <ReviewCardDeux key={review.name} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:left-0 md:w-1/12 md:bg-gradient-to-r md:from-background/90 dark:from-background"></div>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:right-0 md:w-1/12 md:bg-gradient-to-l md:from-background/90 dark:from-background"></div>
      </div>

      <h2> {t('pressTitle')} </h2>
      <div className="relative flex h-[250] w-full flex-col items-center justify-center overflow-hidden my-8">
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {press.map((review) => (
            <ReviewCardDeux key={review.name} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:left-0 md:w-1/12 md:bg-gradient-to-r md:from-background/90 dark:from-background"></div>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:right-0 md:w-1/12 md:bg-gradient-to-l md:from-background/90 dark:from-background"></div>
      </div>
    </>
  )
}
