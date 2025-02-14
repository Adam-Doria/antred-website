import { Badge } from '@/components/ui/badge'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface CardProps {
  name: string
  title?: string
  imageUrl: string
  link?: string
  employment?: string
  isFounder?: boolean
}

export default function ProfileCard({
  name,
  title,
  imageUrl,
  employment,
  isFounder
}: CardProps) {
  const t = useTranslations('profileCard')
  return (
    <div className="w-full max-w-sm my-4 rounded-lg overflow-hidden shadow-lg p-4 bg-white dark:bg-dark-background">
      <div className="relative rounded-lg h-64 w-full bg-background">
        <Image
          src={imageUrl}
          alt={`Photo de ${name}`}
          layout="fill"
          objectFit="contain"
        />
        {isFounder && (
          <Badge variant="green" className="absolute top-3 right-2">
            {t('founder')}
          </Badge>
        )}
      </div>
      <div className="px-6 pt-4">
        <div className="font-bold text-xl text-foreground mb-2">{name}</div>
        <p className="bg-brand-700 rounded-full px-3 pt-1 text-sm font-semibold text-secondaryForeground inline-block">
          {title ?? employment}
        </p>
      </div>
    </div>
  )
}
