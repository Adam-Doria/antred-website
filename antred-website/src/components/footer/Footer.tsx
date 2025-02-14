import { useTranslations } from 'next-intl'
import { Contact } from '../contact/Contact'
import Image from 'next/image'
import Link from 'next/link'
import { LocaleSwitch } from '../system/localeSwitch/LocaleSwitch'
import { Heart } from 'lucide-react'
import { FooterSection } from './FooterHelperComponents'

export const Logo = () => (
  <Image src="/logos/logoBlanc.svg" alt="Antred logo" fill />
)

export const Footer = () => {
  const t = useTranslations('footer')
  return (
    <>
      <div className=" w-full rounded-lg bg-brand-radial p-4">
        <div className=" w-full flex justify-between p-1  sm:p-2">
          <LocaleSwitch class="hidden sm:flex sm:text-white sm:bg-dark-background text-brand" />
          <Link href="/" className="relative w-[100px] ">
            <Logo />
          </Link>
          <Link href="/helpUs">
            <span className="inline-flex items-center text-white bg-accent font-bold p-1 px-2 rounded-sm text-sm hover:bg-accent/75 sm:text-md">
              {t('helpUs.button')}
              <Heart className="m-1 h-4 w-4 text-white fill-white" />
            </span>
          </Link>
        </div>
        <FooterSection />
        <Contact class=" mt-2 w-3/5 space-x-2 sm:w-1/5 sm:h-6 sm:space-x-0 lg:h-8 lg:w-2/5" />
      </div>
      <div className="w-full inline-flex justify-around p-1 text-xxs sm:text-xs ">
        <div className="inline-flex">
          {t('developper')}{' '}
          <a
            href="https://www.linkedin.com/in/adam-drici/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium ml-1"
          >
            Adam Drici
          </a>
        </div>
        <a
          href="/files/status_antred.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('legal')}
        </a>
        <a
          href="/files/réglement_intérieur.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('mentions')}
        </a>
      </div>
    </>
  )
}
