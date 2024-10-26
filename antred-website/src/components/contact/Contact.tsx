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
    href: 'https://www.facebook.com/people/Association-nationale-Tiphaine-pour-la-Recherche-%C3%A0-lEtranger-des-Disparus/61563721569699/?_rdr'
  },
  {
    name: 'Instagram',
    logo: 'instagram.svg',
    href: 'https://www.instagram.com/antred'
  },
  {
    name: 'Telegram',
    logo: 'telegram.svg',
    href: 'https://t.me/+330610446720?text=Bonjour%2C%20je%20vous%20contact%20%C3%A0%20propos%20de%20l%27antred.%0ASeriez%20vous%20disponible%20pour%20%C3%A9changer%3F'
  },
  {
    name: 'WhatsApp',
    logo: 'whatsapp.svg',
    href: 'https://wa.me/+330610446720/?text=Bonjour%2C%20je%20vous%20contact%20%C3%A0%20propos%20de%20l%27antred.%0ASeriez%20vous%20disponible%20pour%20%C3%A9changer%3F'
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className=" relative w-full h-full"
    >
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
