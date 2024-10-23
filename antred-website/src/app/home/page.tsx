import { ContactUs } from './ContactUs'
import { Hero } from './Hero'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4">
      <Hero />
      <div> TODO ADD tabs with latest news and important links </div>
      <div>
        {' '}
        TODO ADD nav for article catgories. May be wait for db to be initiate
        since there is actually no news{' '}
      </div>
      <ContactUs />
      <div> TODO ADD medias and sponsor logos</div>
    </main>
  )
}
