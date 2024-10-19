import { useTranslations } from 'next-intl'
import Link from 'next/link'

type MenuItem = {
  title: string
  href: string
}

type FooterSection = {
  title: string
  items: MenuItem[]
  href: string
}

type FooterMenuProps = {
  sections: FooterSection[]
}
//@TODO remplacer toutes les adresses et faire un fichier de ref pour les adresses
export const PRACTICAL_ADVICE = [
  {
    title: 'practicalAdvice.whatToDo',
    href: '/conseils-pratiques/que-faire-en-cas-de-disparition'
  },
  {
    title: 'practicalAdvice.legalHelp',
    href: '/conseils-pratiques/aide-juridique'
  },
  {
    title: 'practicalAdvice.createMissingNotice',
    href: '/conseils-pratiques/creer-un-avis-de-disparition'
  },
  {
    title: 'practicalAdvice.fundraising',
    href: '/conseils-pratiques/lever-des-fonds'
  },
  {
    title: 'practicalAdvice.usefulLinks',
    href: '/conseils-pratiques/liens-utiles'
  },
  {
    title: 'practicalAdvice.resources',
    href: '/conseils-pratiques/ressources'
  }
]

export const ABOUT_US = [
  { title: 'aboutUs.whoWeAre', href: '/qui-sommes-nous' },
  { title: 'aboutUs.ourMission', href: '/notre-mission' },
  { title: 'aboutUs.team', href: '/equipe' },
  { title: 'aboutUs.partners', href: '/partenaires' }
]

export const DISAPPEARANCES = [
  {
    title: 'disappearances.theyDisappeared',
    href: '/disparitions/ils-ont-disparu'
  },
  {
    title: 'disappearances.searchByCountry',
    href: '/disparitions/recherche-par-pays'
  },
  {
    title: 'disappearances.familyNews',
    href: '/disparitions/actualites-familles'
  },
  {
    title: 'disappearances.expertAdvice',
    href: '/disparitions/conseils-experts'
  }
]

export const HELP_US = [
  { title: 'helpUs.donate', href: '/faire-un-don' },
  { title: 'helpUs.joinUs', href: '/nous-rejoindre' },
  { title: 'helpUs.volonteer', href: '/nous-aider#devenir-benevole' }
]

export const SECTIONS: FooterSection[] = [
  { title: 'aboutUs.title', items: ABOUT_US, href: '/antred' },
  {
    title: 'practicalAdvice.title',
    items: PRACTICAL_ADVICE,
    href: '/conseils-pratiques'
  },
  {
    title: 'disappearances.title',
    items: DISAPPEARANCES,
    href: '/disparitions'
  },
  { title: 'helpUs.title', items: HELP_US, href: '/nous-aider' }
]

export const FooterMenu: React.FC<FooterMenuProps> = ({
  sections
}: FooterMenuProps) => {
  const t = useTranslations('footer')
  return (
    <div className=" w-4/5 pl-2 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4">
      {sections.map((section) => (
        <div key={section.title}>
          <Link
            href={section.href}
            className="text-gray-200 hover:text-gray-300"
          >
            <h5 className="font-bold mt-4 mb-2 ">{t(section.title)}</h5>{' '}
          </Link>
          <ul className="space-y-2 ">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-gray-200 hover:text-gray-400"
                >
                  {t(item.title)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export const FooterSection = () => {
  return (
    <div className="w-full inline-flex justify-center px-2 pl-16 text-white text-sm">
      <FooterMenu sections={SECTIONS} />
    </div>
  )
}
