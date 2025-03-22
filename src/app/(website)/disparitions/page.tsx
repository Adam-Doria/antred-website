import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  MissingPersonData,
  missingPersonData
} from '../../../features/missingPersons/missingPerson'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

function MissingCard(props: MissingPersonData) {
  const imageSrc = props.images?.[0]

  return (
    <div className=" md:max-w-[25%] w-full relative overflow-hidden rounded-md shadow-xl mx-auto">
      <Image
        src={`/${imageSrc}`}
        alt={`${props?.firstName} ${props?.lastName}`}
        fill
        style={{
          objectFit: 'cover'
        }}
        className=" transition-all duration-500 filter grayscale hover:filter-none "
      />

      <div className="  pointer-events-none filter-none relative z-10 flex flex-col justify-end h-96 p-4 bg-transparent">
        <div className="text-dark-foreground">
          <h3 className="font-bold w-fit rounded-lg px-2  ">
            {`${props?.firstName} ${props?.lastName}`}
          </h3>
          <p className="font-bold text-base w-fit bg-accent/55 rounded-lg px-2 my-4">
            {props?.country}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const t = useTranslations('disappearance')
  return (
    <main className="flex min-h-fit flex-col items-center overflow-hidden justify-between pt-24 px-4 my-4 space-y-4">
      <div className="w-full rounded-lg bg-brand-radial p-4 sm:p-6 md:p-8 relative">
        <div className="relative w-full flex flex-col ">
          <h2
            dangerouslySetInnerHTML={{ __html: t.raw('title') }}
            className="text-dark-foreground   mb-4 text-center"
          />
          <p className="text-lg text-dark-secondaryForeground text-pretty  mb-4  mx-auto">
            {t('subtitle')}
          </p>
          <Link href={'/nous-aider'} className=" mx-auto">
            <Button className="rounded-xl text-lg text-white p-8 bg-accent  border-none mx-auto font-bold hover:bg-accent/70 my-4">
              {t('button')}
              <ArrowUpRight />
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[150px] -left-[150px] w-[250px] h-[250px] border-2 border-white/10 rounded-full" />
          <div className="absolute -top-[150px] -left-[150px] w-[300px] h-[300px] border-2 border-white/10 rounded-full" />
          <div className="absolute -bottom-[100px] -right-[100px] w-[200px] h-[200px] border-2 border-white/10 rounded-full" />
          <div className="absolute -bottom-[100px] -right-[100px] w-[250px] h-[250px] border-2 border-white/10 rounded-full" />
        </div>
      </div>
      <section className="w-full flex flex-wrap gap-4 justify-evenly mb-10">
        {missingPersonData.map((person: MissingPersonData) => (
          <MissingCard key={person?.lastName} {...person} />
        ))}
      </section>
    </main>
  )
}
