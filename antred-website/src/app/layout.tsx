import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { montserrat, bontang } from '@/components/system/typography/fonts/font'
import { ThemeProvider } from '@/style/themes'
import '../style/globals.css'
import { DesktopNavbar } from '@/components/system/navbar/DesktopNavbar'

export const metadata: Metadata = {
  title: 'ANTRED',
  description:
    'Association Nationale Tiphaine pour la Recherche à l Étranger des'
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
            <DesktopNavbar />
            <div className="max-w-7xl mx-auto ">
              {children}
              <footer>Footer</footer>
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
