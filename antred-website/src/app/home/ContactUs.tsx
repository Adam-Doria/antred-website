import { useTranslations } from 'next-intl'
import { Contact } from '@/components/contact/Contact'
import { Mail, PhoneCallIcon } from 'lucide-react'

export const ContactUs = () => {
  const t = useTranslations('homepage.contact')
  return (
    <div className="container  p-4 lg:p-8  w-full  bg-brand-radial rounded-sm lg:flex-row my-2">
      <h2 className="text-primary-foreground font-normal text-center pt-4 text-pretty ">
        {t('title').toUpperCase()}
      </h2>
      <h3 className="text-primary-foreground font-normal text-center pb-4 text-xl pt-2 text-pretty">
        {t('subtitle')}
      </h3>
      <div className="text-gray-300 text-md pt-2  pb-6 text-pretty md:text-lg md:w-4/5 md:mx-auto">
        {t('text')}
      </div>
      <div className="flex  text-primary-foreground flex-col w-full space-around text-md md:flex-row md:text-lg md:items-center md:w-4/5 md:justify-around md:mx-auto">
        <div className="inline-flex lg:items-center ">
          {' '}
          <PhoneCallIcon className="mx-2 " />
          {t('phone')}
        </div>
        <a
          href="mailto:contact@antred.fr"
          className="my-2 inline-flex lg:items-center "
        >
          {' '}
          <Mail className="mx-2" />
          contact.antred@gmail.com
        </a>
      </div>

      <Contact class=" mt-2 w-4/5 space-x-2  md:h-10 md:space-x-2 md:w-2/5" />
    </div>
  )
}
