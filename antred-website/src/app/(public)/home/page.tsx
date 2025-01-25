import { ContactUs } from './ContactUs'
import { Hero } from './Hero'
import { PressAndPartner } from './PressPartner'
import { SubHero } from './SubHero'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4">
      <Hero />
      <SubHero />
      {/*@TODO ADD nav for article catgories. May be wait for db to be initiate*/}
      <ContactUs />
      <PressAndPartner />
    </main>
  )
}
