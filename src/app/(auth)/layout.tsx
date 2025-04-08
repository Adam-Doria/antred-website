import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { montserrat, bontang } from '@/components/typography/fonts/font'
import { ThemeProvider } from '@/style/themes'
import '@/style/globals.css'

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
            <div>{children}</div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
