import '../src/style/globals.css'
import { withThemeByClassName } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import nextIntl from './next-intl'
import React from 'react'
import { NextIntlClientProvider } from 'next-intl'

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  tags: ['autodocs'],
  initialGlobals: {
    locale: 'fr',
    locales: {
      en: 'English',
      fr: 'Français'
    }
  },
  parameters: {
    nextIntl,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark'
      },
      defaultTheme: 'light'
    })
    // (Story, context) => {
    //   const locale = context.globals.locale;
    // console.log(context.globals)
    //   return (
    //     <NextIntlClientProvider
    //       locale={locale}
    //       messages={nextIntl.messagesByLocale[locale]}
    //     >
    //       <Story />
    //     </NextIntlClientProvider>
    //   );
    // }
  ]
}

export default preview

// export const globalTypes = {
//   locale: {
//     name: 'Locale',
//     description: 'Internationalization locale',
//     toolbar: {
//       icon: 'globe',
//       items: [
//         { value: 'en', title: 'English' },
//         { value: 'de', title: 'Deutsch' },
//       ],
//       showName: true,
//     },
//   },
//  };
