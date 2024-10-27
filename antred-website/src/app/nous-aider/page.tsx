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

function FAQ() {
  const faqItems = [
    {
      value: 'item-1',
      question: `Comment puis-je devenir bénévole pour l'ANTRED ?`,
      answer:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae sunt et tempora voluptate adipisci? Sed excepturi expedita, tenetur, labore dolorem quos est, iusto repellat laboriosam enim eveniet magnam? Blanditiis inventore ipsam dolorum alias laborum tempore, doloremque, magnam itaque id officia similique. Omnis quia consequuntur accusamus animi quos qui a dolorem.'
    },
    {
      value: 'item-2',
      question:
        'Puis-je contribuer financièrement pour soutenir les recherches et les familles ?',
      answer:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil enim quis possimus obcaecati ipsa delectus eligendi, ipsam, architecto modi vitae rem dicta cumque nam numquam ipsum ex perferendis fuga magnam.'
    },
    {
      value: 'item-3',
      question: 'Comment l’ANTRED utilise-t-elle les fonds collectés ?',
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita delectus eos deleniti neque a quibusdam, aspernatur nesciunt quisquam cumque nemo quo! Odit natus veritatis libero, eos qui quas. Molestias, ea assumenda officia qui minima aliquid aut quo veritatis asperiores vel?'
    },
    {
      value: 'item-4',
      question: `L'ANTRED peut-elle fournir une aide sur place en cas de disparition à l’étranger ?`,
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita delectus eos deleniti neque a quibusdam, aspernatur nesciunt quisquam cumque nemo quo! Odit natus veritatis libero, eos qui quas. Molestias, ea assumenda officia qui minima aliquid aut quo veritatis asperiores vel?'
    },
    {
      value: 'item-5',
      question: `Quels types d'experts travaillent avec l'ANTRED ?`,
      answer:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita delectus eos deleniti neque a quibusdam, aspernatur nesciunt quisquam cumque nemo quo! Odit natus veritatis libero, eos qui quas. Molestias, ea assumenda officia qui minima aliquid aut quo veritatis asperiores vel?'
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
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4 my-4 space-y-8">
      <div className="container flex p-0 flex-col w-full bg-brand-radial rounded-sm lg:flex-row lg:h-[500px] lg:rounded-xl">
        <div className="px-8  lg:pt-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
          <h2 className="text-primary-foreground font-normal  pt-6 lg:pt-0 ">
            {t('title')}
          </h2>
          <h3 className="text-gray-300   mb-4 ">{t('subtitle')}</h3>
          <div className="text-gray-300 text-xl pt-2">{t('description')}</div>
        </div>
        <div className="w-full h-56 lg:h-full lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 h-[200%] lg:h-full lg:w-full">
            <Image
              src={'/logos/whiteIcon.png'}
              fill
              alt="logo de antred association Nationale Tiphaine pour la Recherche à l Etranger des Disparus"
              objectFit="contain"
            />
          </div>
        </div>
      </div>
      <section className="w-full">
        <h2 className="inline-flex">
          {t('donate')}
          <GoHeartFill className="mx-4 text-accent" />
        </h2>
        <div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
          nesciunt laboriosam fugiat quasi debitis voluptate? Consectetur magni
          impedit aspernatur, corporis ducimus similique incidunt aliquid totam.
          Maxime, possimus. Eaque, ullam nihil?
        </div>
      </section>
      <section className="w-full">
        <h2>{t('joinUs')}</h2>
        <div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
          nesciunt laboriosam fugiat quasi debitis voluptate? Consectetur magni
          impedit aspernatur, corporis ducimus similique incidunt aliquid totam.
          Maxime, possimus. Eaque, ullam nihil?
        </div>
      </section>

      <section className="text-center w-full my-4" id="contact">
        <div className="container  p-4 lg:p-6  w-full  bg-brand-radial rounded-sm lg:flex-row space-y-4">
          <h2 className="text-primary-foreground font-normal text-center text-pretty ">
            {t('contact.title')}
          </h2>

          <div className="text-gray-300 text-md  text-pretty md:text-lg md:w-4/5 md:mx-auto">
            {t('contact.text')}
          </div>
          <div className="flex  text-primary-foreground tet-bold flex-col w-full space-around text-md md:flex-row md:text-lg md:items-center md:w-4/5 md:justify-around md:mx-auto">
            <a
              href="mailto:contact@antred.fr"
              className="inline-flex lg:items-center mb-4 "
            >
              {' '}
              <Mail className="mx-2" />
              contact.antred@gmail.com
            </a>
          </div>

          <Contact class="w-4/5 space-x-2  md:h-10 md:space-x-2 md:w-2/5" />
        </div>
      </section>
      <section className="w-full">
        <h2>{t('faq')}</h2>
        <FAQ />
      </section>
    </main>
  )
}
