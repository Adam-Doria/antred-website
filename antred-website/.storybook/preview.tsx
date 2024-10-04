import '../src/style/globals.css'
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/react'
import nextIntl from './next-intl'
import React from 'react';


/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  tags: ['autodocs'],
  initialGlobals: {
    locale: 'fr',
    locales: {
      en: 'English',
      fr: 'Français',
    },
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
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story: any) => (
      <div style={{ padding: "2rem" }}>
        <Story />
      </div>
    )

  ],
}

export default preview
