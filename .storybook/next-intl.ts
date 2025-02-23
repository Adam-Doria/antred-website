import fr from '../src/locales/fr.json'
import en from '../src/locales/en.json'

const messagesByLocale: Record<string, any> = { en, fr }

const nextIntl = {
  defaultLocale: 'fr',
  messagesByLocale
}

export default nextIntl
