import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '../themeToggle/ThemeToggle'
import { LocaleSwitch } from '../localeSwitch/LocaleSwitch'

export const DesktopNavbar = () => {
  const t = useTranslations('navigation')
  return (
    <nav className="pt-4 fixed flex w-full max-w-7xl justify-evenly">
      <Image
        src="/logos/text-icon.png"
        alt="Antred logo"
        width={154}
        height={45}
        className="ml-2"
      />
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger> {t('home')} </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger> {t('ourMission')} </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {' '}
              {t('practicalAdvice')}{' '}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              {' '}
              {t('disappearances')}{' '}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink>Link</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/helpUs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <span className="inline-flex items-center text-accent">
                  {t('helpUs')}
                  <Heart className="ml-2 h-4 w-4 text-accent fill-accent" />
                </span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <LocaleSwitch className="inline-flex items-center text-l" />
      <ThemeToggle />
    </nav>
  )
}
