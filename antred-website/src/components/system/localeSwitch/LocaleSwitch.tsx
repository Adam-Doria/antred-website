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

export const LocaleSwitch = () => {
  const onSelectChange = (value: string) => setUserLocale(value as Locale)
  const locales = { fr: 'FR 🇫🇷', en: 'EN 🏴󠁧󠁢󠁥󠁮󠁧󠁿' }

  return (
    <Select onValueChange={onSelectChange}>
      <SelectTrigger className="w-[100px] border-none ml-2">
        <SelectValue placeholder={locales.fr} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fr">{locales.fr}</SelectItem>
        <SelectItem value="en">{locales.en}</SelectItem>
      </SelectContent>
    </Select>
  )
}
