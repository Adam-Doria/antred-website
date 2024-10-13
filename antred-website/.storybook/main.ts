import type { StorybookConfig } from '@storybook/experimental-nextjs-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
    '@storybook/addon-themes',
    '@storybook/addon-a11y', // handle accessibility
    '@storybook/addon-storysource', // show story source code
    'storybook-next-intl',
  ],
  framework: {
    name: '@storybook/experimental-nextjs-vite',
    options: {}
  },

}
export default config
