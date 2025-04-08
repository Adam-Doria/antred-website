import { Montserrat } from 'next/font/google'
import localFont from 'next/font/local'

export const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-montserrat',
  subsets: ['latin']
})

export const bontang = localFont({
  src: '../../../../public/fonts/Bontang.otf',
  variable: '--font-bontang'
})
