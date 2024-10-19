import Image from 'next/image'

type Props = {
  class?: string
}

type MediaItems = {
  name: string
  logo: string
  href: string
}

export const SOCIAL_MEDIAS: MediaItems[] = [
  {
    name: 'Facebook',
    logo: 'facebook.svg',
    href: 'https://www.facebook.fr/antred'
  },
  {
    name: 'Instagram',
    logo: 'instagram.svg',
    href: 'https://www.instagram.com/antred'
  },
  {
    name: 'Telegram',
    logo: 'telegram.svg',
    href: 'https://t.me/antred'
  },
  {
    name: 'WhatsApp',
    logo: 'whatsapp.svg',
    href: 'https://wa.me/+33660995499/?text=Bonjour%je%vous%contact%a%props%de%lAntred'
  },
  {
    name: 'YouTube',
    logo: 'youtube.svg',
    href: 'https://www.youtube.com/antred'
  },
  {
    name: 'LinkedIn',
    logo: 'linkedin.svg',
    href: 'https://www.linkedin.com/company/antred'
  }
]

const MediaLink = ({ name, logo, href }: MediaItems) => {
  return (
    <a href={href} className=" relative w-full h-full">
      <Image
        alt={name}
        src={`/logos/socialMedias/${logo}`}
        fill
        className="object-contain transform transition-transform duration-300 hover:scale-125"
      />
    </a>
  )
}

export const Contact = (props: Props) => {
  return (
    <div className={`flex ${props.class} h-10 mx-auto m-2`}>
      {SOCIAL_MEDIAS.map((media: MediaItems, index: number) => (
        <MediaLink
          href={media.href}
          key={`${index}${media.name}`}
          name={media.name}
          logo={media.logo}
        />
      ))}
    </div>
  )
}
