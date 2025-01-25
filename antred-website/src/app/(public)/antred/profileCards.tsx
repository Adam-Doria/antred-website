import { LinkedinIcon, Facebook } from 'lucide-react'
import Image from 'next/image'

interface CardProps {
  name: string
  title: string
  imageUrl: string
  linkedinUrl?: string
  facebookUrl?: string
}

export default function ProfileCard({
  name,
  title,
  imageUrl,
  linkedinUrl,
  facebookUrl
}: CardProps) {
  return (
    <div className="w-full max-w-sm my-4 rounded-lg overflow-hidden shadow-lg p-4 bg-white dark:bg-dark-background">
      <div className="relative rounded-lg h-64 w-full bg-background">
        <Image
          src={imageUrl}
          alt={`Photo de ${name}`}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="px-6 pt-4">
        <div className="font-bold text-xl text-foreground mb-2">{name}</div>
        <p className="bg-brand-700 rounded-full px-3 pt-1 text-sm font-semibold text-secondaryForeground inline-block">
          {title}
        </p>
      </div>
      <div className="px-6 pt-2 pb-4">
        {linkedinUrl && (
          <a
            href={linkedinUrl}
            className="mr-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon className="inline-block w-6 h-6" />
          </a>
        )}
        {facebookUrl && (
          <a
            href={facebookUrl}
            className="mr-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="inline-block w-6 h-6" />
          </a>
        )}
      </div>
    </div>
  )
}
