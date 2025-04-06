import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PressAndPartnerCardProps {
  img: string
  name: string
  body: string
  src?: string
}

export const PressAndPartnerCard = ({
  img,
  src,
  body
}: PressAndPartnerCardProps) => {
  return (
    <a href={src} target="_blank" rel="noopener noreferrer">
      <figure
        className={cn(
          'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 bg-background ',
          // light styles
          'border-gray-950/[.1]  hover:bg-gray-950/[.05]',
          // dark styles
          'dark:border-green-950 dark:hover:bg-secondaryBackground'
        )}
      >
        <div className="flex flex-col items-center justify-center overflow-hidden relative h-[180px]">
          <div className="h-1/2 w-full relative">
            <Image
              src={`/images/presse/${img}`}
              alt={`logo de ${img}`}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1 mt-4  text-center text-ellipsis">
            <blockquote className="text-base italic font-light text-gray-700 dark:text-gray-300 leading-relaxed">
              {body}
            </blockquote>
          </div>
        </div>
      </figure>
    </a>
  )
}
