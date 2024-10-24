import { Button } from '@/components/ui/button'
import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Globe } from './Globe'

export const Hero = () => {
  const t = useTranslations('homepage')
  return (
    <div className="container flex p-0 flex-col w-full bg-brand-radial rounded-sm lg:flex-row lg:h-[500px] lg:rounded-xl">
      <div className="px-8  lg:pt-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
        <h2 className="text-primary-foreground font-normal  pt-6 lg:pt-0 ">
          {t('hero.title').toUpperCase()}
        </h2>
        <div className="text-gray-300 text-xl pt-2">
          {t('hero.description')}
        </div>
        <Link href={'/antred'}>
          <Button
            variant={'outline'}
            className="rounded-xl text-black font-bold hover:bg-primary/90 hover:text-accent-foreground my-4"
          >
            {t('hero.button')}
            <ArrowUpRight />
          </Button>
        </Link>
      </div>
      <div className="w-full h-56 lg:h-full lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 h-[200%] lg:h-full lg:w-full">
          <Globe />
        </div>
      </div>
    </div>
  )
}
