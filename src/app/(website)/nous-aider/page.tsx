import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Mail } from 'lucide-react'
import { Contact } from '@/components/contact/Contact'
import { GoHeartFill } from 'react-icons/go'
import Image from 'next/image'
import { HelloAssoWidget } from './helloAssoWidget'

function FAQ() {
  const faqItems = [
    {
      value: 'item-1',
      question: `Comment puis-je devenir bénévole pour l'ANTRED ?`,
      answer: `Pour devenir bénévole à l'ANTRED, il vous suffit de nous contacter à benevolat@antred.org pour proposer vos compétences. Les besoins des familles varient en fonction des situations, et chaque contribution est précieuse. Par exemple, vous pouvez intervenir en tant que juriste, interprète, traducteur, graphiste, psychologue, community manager… Si vous êtes un génie de la recherche en sources ouvertes ou si vous savez soulever une communauté sur les réseaux comme personne, n’hésitez pas à nous rejoindre. `
    },
    {
      value: 'item-2',
      question:
        'Puis-je contribuer financièrement pour soutenir les recherches et les familles ?',
      answer: `Oui, vous pouvez tout à fait contribuer financièrement pour soutenir les recherches et aider les familles. Votre don permettra de financer des actions concrètes comme les déplacements des familles, l’intervention d’enquêteurs privés, les frais d’interprètes, ainsi que de soutenir les projets de l'ANTRED et d'apporter un soutien aux victimes. Quel que soit le montant, votre geste est précieux et peut faire la différence.`
    },
    {
      value: 'item-4',
      question: `L'ANTRED peut-elle fournir une aide sur place en cas de disparition à l’étranger ?`,
      answer: `  L'ANTRED peut intervenir directement sur place en cas de disparition à l'étranger, lorsque cela est possible et, surtout, si cela s'avère nécessaire. Nous mobilisons notre réseau pour identifier les professionnels et les contacts les mieux placés pour apporter leur aide. Nous cherchons à établir des collaborations locales, prenons contact avec les autorités à la demande des familles. N'hésitez pas à nous appeler ou nous écrire pour discuter de votre situation spécifique et des actions possibles.`
    },
    {
      value: 'item-5',
      question: `Quels types d'experts travaillent avec l'ANTRED ?`,
      answer: ` L'ANTRED travaille avec une variété d'experts afin de répondre au mieux aux besoins des familles. . Parmi eux, l'association peut compter sur des professionnels du droit, des policiers et gendarmes, des ingénieurs, des experts en téléphonie, ainsi que sur des enquêteurs privés, des psychologues, des interprètes et des spécialistes en recherches en sources ouvertes. Chaque nouvelle disparition est l'occasion de solliciter notre réseau pour identifier la personne compétente, en fonction des spécificités de chaque situation`
    },
    {
      value: 'item-6',
      question: `Comment signaler la disparition d'un proche ?`,
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita delectus eos deleniti neque a quibusdam, aspernatur nesciunt quisquam cumque nemo quo! Odit natus veritatis libero, eos qui quas. Molestias, ea assumenda officia qui minima aliquid aut quo veritatis asperiores vel?'
    }
  ]

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger className="text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default function Page() {
  const t = useTranslations('helpUs')
  return (
    <main className="flex w-full min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4 my-4 space-y-8">
      <div className="flex p-0 flex-col w-full bg-brand-radial rounded-sm lg:flex-row lg:h-[500px] lg:rounded-xl">
        <div className="px-8  lg:pt-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
          <h2 className="text-dark-foreground font-normal  pt-6 lg:pt-0 ">
            {t('title')}
          </h2>
          <h3 className="text-dark-foreground   mb-4 "> {t('subtitle')} </h3>
          <div className="text-dark-secondaryForeground text-xl pt-2">
            {t('description')}
          </div>
        </div>
        <div className="w-full h-56 lg:h-full lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 h-[200%] lg:h-full lg:w-full">
            <Image
              src={'/logos/whiteIcon.png'}
              fill
              alt="logo de antred association Nationale Tiphaine pour la Recherche à l Etranger des Disparus"
              style={{
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </div>
      <section className="w-full" id="donate">
        <h2 className="inline-flex">
          {t('donate')}
          <GoHeartFill className="mx-4 text-accent" />
        </h2>
        <HelloAssoWidget
          height="1100px"
          className="h-[1100px]"
          src="https://www.helloasso.com/associations/antred/formulaires/1/widget"
        />
      </section>
      <section className="w-full">
        <h2 className="pb-4">{t('joinUs')}</h2>
        <HelloAssoWidget
          className="h-[650px]"
          src="https://www.helloasso.com/associations/antred/adhesions/votre-engagement-compte-adherez-a-l-antred-des-aujourd-hui/widget"
        />
      </section>

      <section className="text-center w-full my-4" id="volunteer">
        <div className="p-4 lg:p-6  w-full  bg-brand-radial rounded-sm lg:flex-row space-y-4">
          <h2 className="text-dark-foreground font-normal text-center text-pretty ">
            {t('contact.title')}
          </h2>

          <div className="text-dark-secondaryForeground 0 text-md  text-pretty md:text-lg md:w-4/5 md:mx-auto">
            {t('contact.text')}
          </div>
          <div className="flex  text-dark-secondaryForeground  text-bold flex-col w-full space-around text-md md:flex-row md:text-lg md:items-center md:w-4/5 md:justify-around md:mx-auto">
            <a
              href="mailto:contact@antred.org"
              className="inline-flex lg:items-center mb-4 "
            >
              {' '}
              <Mail className="mx-2" />
              contact@antred.org
            </a>
          </div>

          <Contact class="w-4/5 space-x-2  md:h-10 md:space-x-2 md:w-2/5" />
        </div>
      </section>
      <section className="w-full" id="faq">
        <h2>{t('faq')}</h2>
        <FAQ />
      </section>
    </main>
  )
}
