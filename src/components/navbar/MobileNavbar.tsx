'use client'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Menu, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch'
import { ThemeToggle } from '../themeToggle/ThemeToggle'
import { Logo } from './NavHelperComponents'
import Link from 'next/link'
import { useCallback, useState } from 'react'

export const MobileNavbar: React.FC = () => {
  const t = useTranslations('navigation')
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background z-50 lg:hidden ">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              asChild
              className="bg-dark-background text-dark-foreground hover:bg-secondaryForeground rounded-md "
            >
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/public"
                  className="text-md font-semibold"
                  onClick={closeMenu}
                >
                  {t('home')}
                </Link>
                <Link
                  href="/antred"
                  className="text-md font-semibold"
                  onClick={closeMenu}
                >
                  {t('ourMission')}
                </Link>
                <Link
                  href="/conseils-pratiques"
                  className="text-md font-semibold"
                  onClick={closeMenu}
                >
                  {t('practicalAdvice.title')}
                </Link>
                <Link
                  href="/disparitions"
                  className="text-md font-semibold"
                  onClick={closeMenu}
                >
                  {t('disappearances.title')}
                </Link>
                <Link
                  href="/nous-aider"
                  className="text-md font-semibold text-accent"
                  onClick={closeMenu}
                >
                  <span className="inline-flex items-center">
                    {t('helpUs')}
                    <Heart className="ml-2 h-4 w-4 text-accent fill-accent" />
                  </span>
                </Link>
                <LocaleSwitch />
              </nav>
            </SheetContent>
          </Sheet>
          <Link href={'/public'}>
            <Logo />
          </Link>
        </div>
        <div className="flex items-center gap-4 ">
          <Link
            href="/nous-aider"
            className="text-md font-semibold text-accent"
          >
            <span className="inline-flex items-center">
              {t('helpUs')}
              <Heart className="ml-2 h-4 w-4 text-accent fill-accent" />
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
