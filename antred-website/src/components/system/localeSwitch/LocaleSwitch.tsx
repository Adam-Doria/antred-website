'use client'
import { setUserLocale } from '@/locales/i18n'
import { Locale } from '@/locales/localesConfig'
import React, { ChangeEvent } from 'react'

export const LocaleSwitch = (props: any) => {
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserLocale(e.target.value as Locale)
  return (
    <label className={props?.className}>
      <select onChange={onSelectChange}>
        <option value="fr">FR 🇫🇷</option>
        <option value="en">EN 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
      </select>
    </label>
  )
}
