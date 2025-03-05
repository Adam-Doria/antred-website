import type { Metadata } from 'next'
import Script from 'next/script'

import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { montserrat, bontang } from '@/components/system/typography/fonts/font'
import { ThemeProvider } from '@/style/themes'
import '@/style/globals.css'
import { Navbar } from '@/components/system/navbar/NavBar'
import { Footer } from '@/components/footer/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: `ANTRED - Association pour la Recherche des Français Disparus à l'Étranger`,
  description: `ANTRED (Association Nationale Tiphaine pour la Recherche à l'Étranger des Disparus) est dédiée au soutien des familles de Français disparus à l'étranger. Nous les accompagnons dans les démarches administratives, les recherches internationales, et la sensibilisation des autorités pour une meilleure prise en charge de ces situations critiques.Recherche et aide en cas de disparition. Aide les familles des victimes.`,
  keywords: [
    'ANTRED',
    'association recherche disparus',
    `Français disparus à l'étranger`,
    'soutien aux familles',
    'aide disparus étrangers',
    'Tiphaine Véron',
    'Damien Véron',
    'disparition internationale',
    'accompagnement administratif',
    'justice internationale',
    'enquêtes disparitions',
    'sensibilisation autorités',
    'disparition',
    'disparus',
    'recherche victimes',
    'recherche disparus',
    'aide judiciaire',
    'justice',
    'police scientifique'
  ],
  authors: [
    { name: 'Association ANTRED', url: 'https://www.antred.fr' },
    { name: 'Association ANTRED', url: 'https://www.antred.org' },
    { name: 'Forenseek', url: 'https://www.forenseek.fr' },
    { name: 'Adam DRICI', url: 'https://www.forenseek.fr' },
    { name: 'Sébastien Aguilar', url: 'https://www.forenseek.fr' }
  ],
  metadataBase: new URL('https://www.antred.fr'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: `ANTRED - Association pour la Recherche des Français Disparus à l'Étranger`,
    description: `L'Association Nationale Tiphaine pour la Recherche à l'Étranger des Disparus (ANTRED) apporte son soutien aux familles de Français disparus à l'étranger, en les aidant dans les démarches administratives, les recherches internationales et la sensibilisation des autorités pour une meilleure gestion de ces situations critiques. Recherche et aide en cas de disparition. Aide les familles des victimes.`,
    url: 'https://www.antred.fr',
    siteName: 'antred.fr',
    type: 'website',
    images: '/opengraph-image.jpg'
  },
  twitter: {
    title: `ANTRED - Association pour la Recherche des Français Disparus à l'Étranger`,
    description: `L'Association Nationale Tiphaine pour la Recherche à l'Étranger des Disparus (ANTRED) apporte son soutien aux familles de Français disparus à l'étranger, en les aidant dans les démarches administratives, les recherches internationales et la sensibilisation des autorités pour une meilleure gestion de ces situations critiques.`,
    images: '/twitter-image.jpg'
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16894381494"
          strategy="afterInteractive"
        />
        <Script id="google-ads-conversion" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16894381494');
        `}
        </Script>
        <Script id="google-ads-specific-conversion" strategy="afterInteractive">
          {`
          function gtag_report_conversion() {
            gtag('event', 'conversion', {
              'send_to': 'AW-16894381494/92dtCOGbhaUaELab7_c-',
              'value': 1.0,
              'currency': 'USD'
            });
            return false;
          }
          gtag_report_conversion();
        `}
        </Script>
      </head>
      <body className={`${montserrat.variable} ${bontang.variable} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <div className="max-w-screen-2xl mx-auto ">
              {children}
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
