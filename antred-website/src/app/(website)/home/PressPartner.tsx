import Marquee from '@/components/ui/marquee'
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
    body: 'Vienne : une nouvelle association créée pour aider les familles de disparus',
    img: 'lanouvellerepublique.svg',
    src: 'https://www.lanouvellerepublique.fr/poitiers/vienne-une-nouvelle-association-creee-pour-aider-les-familles-de-disparus'
  },
  {
    name: 'press3',
    body: `Les proches de Tiphaine Veron lancent une association pour aider les familles de disparus à l'étranger`,
    img: 'RFI.svg',
    src: 'https://www.rfi.fr/fr/france/20230729-les-proches-de-tiphaine-veron-lancent-une-association-pour-aider-les-familles-de-disparus-%C3%A0-l-%C3%A9tranger'
  }
]

const Partner = reviews.slice(0, reviews.length / 2)
const press = reviews.slice(reviews.length / 2)

export function PressAndPartner() {
  const t = useTranslations('homepage.pressAndPartner')
  return (
    <>
      <h2 className="mt-4"> {t('partnerTitle')} </h2>
      <h4> {t('partnerSubtitle')}</h4>
      <div className="relative flex h-[250] w-full flex-col items-center justify-center overflow-hidden my-8">
        <Marquee pauseOnHover className=" [--duration:40s]">
          {Partner.map((review) => (
            <PressAndPartner key={review.name} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:left-0 md:w-1/12 md:bg-gradient-to-r md:from-background"></div>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:right-0 md:w-1/12 md:bg-gradient-to-l md:from-background"></div>
      </div>

      <h2> {t('pressTitle')} </h2>
      <div className="relative flex h-[250] w-full flex-col items-center justify-center overflow-hidden my-8">
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {press.map((review) => (
            <PressAndPartner key={review.name} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:left-0 md:w-1/12 md:bg-gradient-to-r md:from-background"></div>
        <div className="pointer-events-none md:absolute md:inset-y-0 md:right-0 md:w-1/12 md:bg-gradient-to-l md:from-background"></div>
      </div>
    </>
  )
}
