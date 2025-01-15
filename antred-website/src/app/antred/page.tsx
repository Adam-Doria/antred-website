/* eslint-disable jsx-a11y/media-has-caption */
import { Hero } from './Hero'
import { useTranslations } from 'next-intl'
import ProfileCard from './profileCards'
import { Mail } from 'lucide-react'
import { Contact } from '@/components/contact/Contact'

const board = [
  {
    id: 1,
    name: 'Damien Véron',
    title: 'Président',
    imageUrl: '/images/bureau/damienV.png',
    facebookUrl: 'fb',
    linkedinUrl: 'link'
  },
  {
    id: 2,
    name: 'Céline Mendes',
    title: 'Secrétaire générale',
    imageUrl: '/images/bureau/celineM.png',
    facebookUrl: 'fb',
    linkedinUrl: 'link'
  },
  {
    id: 3,
    name: 'Pierre-Olivier Lassalle',
    title: 'Trésorier',
    imageUrl: '/images/bureau/pierreO.png',
    facebookUrl: 'fb',
    linkedinUrl: 'link'
  }
]

export default function Page() {
  const t = useTranslations('antredPage')

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4">
      <Hero />

      <section className="pt-10" id="qui-sommes-nous">
        <h2 className="text-center">{t('story.title')}</h2>
        <div className="text-md text-foreground text-pretty pt-4 space-y-4">
          <p>{t('story.paragraph1')}</p>
          <p>{t('story.paragraph2')}</p>
          <p>{t('story.paragraph3')}</p>
          <p>{t('story.paragraph4')}</p>
        </div>
      </section>

      <section className="relative w-full md:pb-[56%] my-8">
        <video
          width="100%"
          height="100%"
          controls
          className="md:absolute md:top-0 md:left-0 w-full h-full rounded-sm object-cover"
        >
          <source src="/videos/antred-introduction.mp4" type="video/mp4" />
        </video>
      </section>

      <section id="notre-mission">
        <h2 className="text-center">{t('mission.title')}</h2>
        <div className="text-md text-foreground text-pretty py-4 space-y-4">
          <p>{t('mission.paragraph1')}</p>
          <p>{t('mission.paragraph2')}</p>
          <ul className="list-inside list-disc px-6 space-y-2">
            <li>{t('mission.examples.legalAdvice')}</li>
            <li>{t('mission.examples.professionalConnections')}</li>
            <li>{t('mission.examples.socialMedia')}</li>
            <li>{t('mission.examples.mediaTraining')}</li>
            <li>{t('mission.examples.supportOnLocation')}</li>
            <li>{t('mission.examples.fundraising')}</li>
            <li>{t('mission.examples.moralSupport')}</li>
          </ul>
          <p>{t('mission.paragraph3')}</p>
        </div>
      </section>

      <section className="text-center w-full " id="equipe">
        <h2>{t('board.title')}</h2>
        <div className="flex w-full flex-wrap justify-around ">
          {board.map((member) => (
            <ProfileCard key={member.id} {...member} />
          ))}
        </div>
        <h2>{t('volunteers.title')}</h2>
      </section>

      <section id="partenaires" className="text-center">
        <h2>{t('partners.title')}</h2>
      </section>

      <section className="text-center w-full my-4" id="contact">
        <div className="container  p-4 lg:p-6  w-full  bg-brand-radial rounded-sm lg:flex-row space-y-4">
          <h2 className="text-dark-foreground font-normal text-center text-pretty ">
            {t('contact.title')}
          </h2>

          <div className="text-dark-secondaryForeground text-md  text-pretty md:text-lg md:w-4/5 md:mx-auto">
            {t('contact.text')}
          </div>
          <div className="flex  text-dark-secondaryForeground tet-bold flex-col w-full space-around text-md md:flex-row md:text-lg md:items-center md:w-4/5 md:justify-around md:mx-auto">
            <a
              href="mailto:contact@antred.fr"
              className="inline-flex lg:items-center mb-4 "
            >
              {' '}
              <Mail className="mx-2" />
              contact.antred@gmail.com
            </a>
          </div>

          <Contact class="  w-4/5 space-x-2  md:h-10 md:space-x-2 md:w-2/5" />
        </div>
      </section>
    </main>
  )
}
