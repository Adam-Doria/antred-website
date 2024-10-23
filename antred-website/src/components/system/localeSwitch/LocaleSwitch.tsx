'use client'
import { setUserLocale } from '@/locales/i18n'
import { Locale } from '@/locales/localesConfig'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useLocale } from 'next-intl'

type LocaleSwitchProps = {
  class?: string
}

export const LocaleSwitch = (props: LocaleSwitchProps) => {
  const onSelectChange = (value: string) => setUserLocale(value as Locale)
  const currentLocale = useLocale() as Locale
  const locales = { fr: 'FR 🇫🇷', en: 'EN 🏴󠁧󠁢󠁥󠁮󠁧󠁿' }

  return (
    <Select onValueChange={onSelectChange}>
      <SelectTrigger className={`w-[100px] border-none ml-2 ${props.class}`}>
        <SelectValue placeholder={locales[currentLocale]} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fr">{locales.fr}</SelectItem>
        <SelectItem value="en">{locales.en}</SelectItem>
      </SelectContent>
    </Select>
  )
}
