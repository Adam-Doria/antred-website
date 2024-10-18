/* eslint-disable jsx-a11y/label-has-associated-control */
'use client'
import { setUserLocale } from '@/locales/i18n'
import { Locale } from '@/locales/localesConfig'
import { ChangeEvent } from 'react'

export const LocaleSwitch = () => {
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserLocale(e.target.value as Locale)
  return (
    <label htmlFor="locale-select">
      <select onChange={onSelectChange}>
        <option value="fr">FR 🇫🇷</option>
        <option value="en">EN 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
      </select>
    </label>
  )
}
