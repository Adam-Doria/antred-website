import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { MissingCard } from '@/features/missingPersons/components/MissingPersonCard'
import { getMissingPerson } from '@/features/missingPersons/actions'

export default async function Page() {
  const { data: missingPerson } = await getMissingPerson({
    page: 1,
    limit: 1000,
    order: 'asc'
  })

  const t = await getTranslations('disappearance')

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
        {missingPerson.map((person) => (
          <MissingCard key={person.id} {...person} />
        ))}
      </section>
    </main>
  )
}
