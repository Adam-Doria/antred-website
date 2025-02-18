import { Button } from '@/components/ui/button'
import { Link, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

interface TabCardsProps {
  date: string
  title: string
  description: string
  buttonText?: string
  buttonLink?: string
  imageUrl: string
  imageAlt: string
}

export const TabCardsCard = ({
  date,
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl,
  imageAlt
}: TabCardsProps) => {
  return (
    <div className=" flex my-4 p-0  flex-col-reverse w-full bg-secondaryBackground rounded-sm lg:flex-row lg:h-[500px]">
      <div className="px-8 py-4 lg:pt-8 lg:w-[55%] lg:flex lg:flex-col lg:justify-center lg:space-y-4">
        <div>{date}</div>
        <h3 className="font-normal pt-6 lg:pt-0">{title}</h3>
        <div className="text-md text-secondaryForeground py-2 text-ellipsis">
          {description}
        </div>
        {buttonText && buttonLink && (
          <Link href={buttonLink} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl  font-bold   my-4">
              {buttonText}
              <ArrowUpRight />
            </Button>
          </Link>
        )}
      </div>
      <div className="w-full h-56  lg:w-[45%] lg:h-full relative  ">
        <div className=" absolute inset-0 h-full  ">
          <Image
            src={imageUrl}
            fill
            alt={imageAlt}
            objectFit="cover"
            className="rounded-lg p-4 "
          />
        </div>
      </div>
    </div>
  )
}
