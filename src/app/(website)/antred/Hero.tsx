import { Button } from '@/components/ui/button'
import { ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export const Hero = () => {
  const t = useTranslations('antredPage')
  return (
    <div className=" flex p-0 flex-col w-full bg-brand-radial rounded-sm lg:flex-row lg:h-[500px] lg:rounded-xl">
      <div className="px-8  lg:pt-8 lg:w-1/2 lg:flex lg:flex-col lg:justify-center lg:space-y-4">
        <h2 className="text-dark-foreground font-normal  pt-6 lg:pt-0 ">
          {t('hero.title')}
        </h2>
        <div className="text-dark-secondaryForeground text-xl pt-2">
          {t('hero.description')}
        </div>
        <Link href={'/antred#contact'}>
          <Button variant={'light'}>
            {t('hero.button')}
            <ArrowDownRight />
          </Button>
        </Link>
      </div>
      <div className="w-full h-56 lg:h-full lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 h-[200%] lg:h-full lg:w-full">
          <Image
            src={'/logos/whiteIcon.png'}
            fill
            alt="logo de antred association Nationale Tiphaine pour la Recherche à l Etranger des Disparus"
            style={{
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
    </div>
  )
}
