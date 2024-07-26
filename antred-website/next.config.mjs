import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin(
  //provide path if int18.json is not in root
  "./src/locales/i18n.ts",
)

/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        fetches: {
          fullUrl: true,
        },
      },
};


export default withNextIntl(nextConfig);
