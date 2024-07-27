import type { StorybookConfig } from '@storybook/nextjs'

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
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  docs: {
    defaultName: 'Documentation'
  }
}
export default config
