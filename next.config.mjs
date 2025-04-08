// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin(
  //provide path if int18.json is not in root
  './src/locales/i18n.ts'
)

let supabaseHostname = ''
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    supabaseHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  }
} catch (error) {
  console.error(`Erreur lors de l'analyse de NEXT_PUBLIC_SUPABASE_URL:`, error)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true
    }
  },

  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: 'https',
            hostname: supabaseHostname
          }
        ]
      : []
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '20mb'
    }
  }
}

export default withNextIntl(nextConfig)
