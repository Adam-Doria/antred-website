import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from 'next-intl'
import { TabCardsCard } from '@/components/cards/TabCards'

const tabs = [
  {
    value: 'lastNews',
    label: 'lastNews',
    date: '1er février 2025',
    title: 'Assemblée Générale d’Unis pour Tiphaine : l’Antred mise en lumière',
    description: `Ce samedi 1er février, l’association Unis pour Tiphaine a tenu son assemblée générale à la librairie-café Aux bavardages, située au 158, Grand’Rue, à Poitiers. Les membres présents ont pu dresser le bilan des actions passées et définir les projets à venir, dans une ambiance conviviale et solidaire. À l’issue de la réunion, une présentation de l’Antred a eu lieu en présence de Sonya Lwu, marraine de l’association, et de Sébastien Aguilar, technicien en police scientifique. Ce moment d’échanges a permis de mieux comprendre le rôle et les missions de l’Antred, renforçant ainsi la coopération entre les différents acteurs engagés dans la recherche de personnes disparues à l’étranger.`,
    imageUrl: '/images/presse/ag-antred.jpg',
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
              className="w-full  grid-cols-2 text-xs font-bold  px-2 py-2 md:text-sm md:px-6 md:py-4 rounded-full border border-brand hover:scale-110  data-[state=active]:bg-brand data-[state=active]:border-brand data-[state=inactive]:text-brand data-[state=inactive]:bg-transparent"
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
            <TabCardsCard {...tab} />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
