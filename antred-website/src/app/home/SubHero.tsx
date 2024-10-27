import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'

const lorem10 =
  'orem ipsum dolor sit amet, consectetur adipisicing elit. Illum reiciendis iure in corporis hic molestias ipsam quaerat suscipit. Accusamus voluptatibus sequi suscipit quae accusantium libero odit minima animi officiis nulla. L'
const lorem50 =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. At cupiditate  magni blanditiis, consequuntur architecto eligendi. Rem dolorum,  praesentium ratione explicabo nostrum dolores, illum molestiae officia  dolorem nobis voluptate recusandae? Velit, saepe architecto. Dolore  tempora dolor cumque quae dolores eum officiis reprehenderit earum  harum, exercitationem ea obcaecati saepe natus ex animi!'

const tabs = [
  {
    value: 'lastNews',
    label: 'lastNews',
    date: '21 juillet 2024',
    title: lorem10,
    description: lorem50,
    imageUrl: '/logos/colored-icon.png',
    imageAlt: `logo de l'anted`
  },
  {
    value: 'Missing',
    date: '13 septembre 2024',
    label: 'missing',
    title:
      'Etats-Unis : Un Français de 76 ans disparaît dans un parc de l’Utah, sa famille « désespérée » lance un appel à témoins',
    description: `Francis Userovici, 76 ans, a été vu la dernière fois le 16 août 2024 au volant de sa voiture alors qu'il entrait dans le parc national d’Arches, dans l’Utah`,
    buttonText: 'Découvez son histoire',
    buttonLink:
      'https://www.20minutes.fr/monde/4109843-20240913-etats-unis-francais-76-ans-disparait-parc-utah-famille-desesperee-lance-appel-temoins',
    imageUrl: '/images/presse/ben.webp',
    imageAlt: 'Photographie de Francis Userovici'
  },
  {
    value: 'FirstAction',
    label: 'firstAction',
    date: ' 1er octobre 2024',
    title: 'Que faire en cas de disparition d’un proche à l’étranger ? ',
    description:
      'Dès les premiers instants de la disparition, le compte à rebours est lancé. La vie de la personne disparue est en jeu. Le démarrage d’une enquête au plus tôt est crucial. Quels sont les premiers gestes d’urgence à accomplir ? Voici nos conseils :',
    buttonText: `Lire l'article`,
    buttonLink:
      '/conseils-pratiques/1/Que%20faire%20en%20cas%20de%20disparition%20d’un%20proche%20à%20l’étranger%20',
    imageUrl: '/images/presse/emergency.jpg',
    imageAlt: 'Première actions à mener'
  },
  {
    value: 'Disappearance',
    label: 'disappearance',
    date: '17 juillet 2024',
    title: 'Pétition pour ELOI ROLLAND disparu en Nouvelle-Zélande ',
    description: `Les autorités néo-zélandaises veulent le déclarer mort... alors que la famille réclame l'ouverture d'une enquête criminelle depuis des années ! 
     Une voix + une voix + une voix + une voix... Ca fait beaucoup d'écho.
      Merci pour vos signatures 💚  un tremplin vers la vérité`,
    buttonText: 'Signer la Pétition',
    buttonLink:
      'https://www.change.org/p/soutenez-notre-famille-pour-eloi-rolland-et-demandez-justice',
    imageUrl: '/images/presse/eloi.jpeg',
    imageAlt: 'Photographie d Eloi Rolland'
  }
]

interface SubHeroProps {
  date: string
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
  imageUrl: string
  imageAlt: string
}

export const SubHeroCard: FC<SubHeroProps> = ({
  date,
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl,
  imageAlt
}) => {
  return (
    <div className="container flex my-4 p-0  flex-col-reverse w-full bg-white rounded-sm lg:flex-row lg:h-[500px]">
      <div className="px-8 py-4 lg:pt-8 lg:w-[55%] lg:flex lg:flex-col lg:justify-center lg:space-y-4">
        <div>{date}</div>
        <h3 className="font-normal pt-6 lg:pt-0">{title}</h3>
        <div className="text-md text-gray-600 py-2 text-ellipsis">
          {description}
        </div>
        {buttonText && buttonLink && (
          <Link href={buttonLink} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl bg-brand-700 text-background font-bold hover:bg-primary/90 hover:text-accent-foreground my-4">
              {buttonText}
              <ArrowUpRight />
            </Button>
          </Link>
        )}
      </div>
      <div className="w-full h-56 lg:h-full rounded-xl lg:w-[45%]   relative overflow-hidden">
        <div className="absolute inset-0 h-full rounded-xl  lg:h-full lg:w-full">
          <Image
            src={imageUrl}
            fill
            alt={imageAlt}
            objectFit="cover"
            className="p-4 rounded-xl "
          />
        </div>
      </div>
    </div>
  )
}

export const SubHero = () => {
  const t = useTranslations('homepage.tabs')
  return (
    <Tabs defaultValue="lastNews" className="my-8 w-full flex flex-col">
      <TabsList className="grid grid-cols-2 gap-x-2 gap-y-2 h-full md:flex md:gap-x-6 md:w-3/5 md:mx-auto">
        {tabs.map((tab, index) => {
          return (
            <TabsTrigger
              key={tab.value + index}
              value={tab.value}
              className="w-full  grid-cols-2 text-xs font-medium  px-2 py-2 md:text-sm md:px-6 md:py-4 rounded-full border hover:scale-110 border-brand-700 data-[state=active]:bg-brand-700 data-[state=active]:text-white data-[state=active]:border-brand-700 data-[state=inactive]:text-brand-700 data-[state=inactive]:bg-transparent"
            >
              {' '}
              {t(tab.label)}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {tabs.map((tab, index) => {
        return (
          <TabsContent
            value={tab.value}
            key={index + tab.value}
            className="my-4"
          >
            <SubHeroCard {...tab} />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
