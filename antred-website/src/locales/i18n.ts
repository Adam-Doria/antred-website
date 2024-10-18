'use server'
import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { Locale, defaultLocale } from './localesConfig'

// The locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE'

export async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value
}

export async function setUserLocale(locale: Locale) {
  cookies().set(COOKIE_NAME, locale)
}

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) ?? defaultLocale

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default
  }
})
