import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { montserrat, bontang } from '@/components/system/typography/fonts/font'
import { ThemeProvider } from '@/style/themes'
import '../style/globals.css'
import { Navbar } from '@/components/system/navbar/NavBar'
import { Footer } from '@/components/footer/Footer'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: `ANTRED - Association pour la Recherche des Français Disparus à l'Étranger`,
  description: `ANTRED (Association Nationale Tiphaine pour la Recherche à l'Étranger des Disparus) est dédiée au soutien des familles de Français disparus à l'étranger. Nous les accompagnons dans les démarches administratives, les recherches internationales, et la sensibilisation des autorités pour une meilleure prise en charge de ces situations critiques.`,
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
    'sensibilisation autorités'
  ],
  authors: [
    { name: 'Association ANTRED', url: 'https://www.antred.fr' },
    { name: 'Association ANTRED', url: 'https://www.antred.org' },
    { name: 'Forenseek', url: 'https://www.forenseek.fr' },
    { name: 'Adam DRICI', url: 'https://www.forenseek.fr' },
    { name: 'Sébastien Aguilar', url: 'https://www.forenseek.fr' }
  ]
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
      <body className={`${montserrat.variable} ${bontang.variable} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <div className="max-w-7xl mx-auto ">
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
