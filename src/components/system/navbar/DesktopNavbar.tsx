'use client'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '../themeToggle/ThemeToggle'
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch'
import {
  DISAPPEARANCES,
  Logo,
  MenuContent,
  MenuLink,
  MissionContent,
  PRACTICAL_ADVICE
} from './NavHelperComponents'

export const DesktopNavbar: React.FC = () => {
  const t = useTranslations('navigation')

  return (
    <nav className="hidden lg:pt-4 lg:fixed lg:flex lg:bg-background lg:w-full lg:justify-center">
      <div className="inline-flex max-w-7xl w-full justify-between">
        <Link href={'/'}>
          <Logo />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <MenuLink href="/">{t('home')}</MenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={'/antred'}>
                <NavigationMenuTrigger>{t('ourMission')}</NavigationMenuTrigger>
              </Link>
              <MissionContent />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={'/conseils-pratiques'}>
                <NavigationMenuTrigger>
                  {t('practicalAdvice.title')}
                </NavigationMenuTrigger>
              </Link>
              <MenuContent items={PRACTICAL_ADVICE} />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={'/disparitions'}>
                <NavigationMenuTrigger>
                  {t('disappearances.title')}
                </NavigationMenuTrigger>
              </Link>
              <MenuContent items={DISAPPEARANCES} />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <MenuLink href="/nous-aider">
                <span className="inline-flex items-center text-accent">
                  {t('helpUs')}
                  <Heart className="mx-2 h-4 w-4 text-accent fill-accent" />
                </span>
              </MenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
          <LocaleSwitch />
          <ThemeToggle />
        </NavigationMenu>
      </div>
    </nav>
  )
}
