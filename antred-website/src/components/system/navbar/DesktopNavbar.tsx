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
import React from 'react'
import { cn } from '@/lib/utils'

// Types
type MenuItem = {
  title: string
  href: string
  description: string
}

// Constants
const PRACTICAL_ADVICE: MenuItem[] = [
  {
    title: 'navigation.practicalAdvice.whatToDo.title',
    href: '/conseils-pratiques/que-faire-en-cas-de-disparition',
    description: 'navigation.practicalAdvice.whatToDo.description'
  },
  {
    title: 'navigation.practicalAdvice.legalHelp.title',
    href: '/conseils-pratiques/aide-juridique',
    description: 'navigation.practicalAdvice.legalHelp.description'
  },
  {
    title: 'navigation.practicalAdvice.createMissingNotice.title',
    href: '/conseils-pratiques/creer-un-avis-de-disparition',
    description: 'navigation.practicalAdvice.createMissingNotice.description'
  },
  {
    title: 'navigation.practicalAdvice.fundraising.title',
    href: '/conseils-pratiques/lever-des-fonds',
    description: 'navigation.practicalAdvice.fundraising.description'
  },
  {
    title: 'navigation.practicalAdvice.usefulLinks.title',
    href: '/conseils-pratiques/liens-utiles',
    description: 'navigation.practicalAdvice.usefulLinks.description'
  },
  {
    title: 'navigation.practicalAdvice.resources.title',
    href: '/conseils-pratiques/ressources',
    description: 'navigation.practicalAdvice.resources.description'
  }
]

const DISAPPEARANCES: MenuItem[] = [
  {
    title: 'navigation.disappearances.theyDisappeared.title',
    href: '/disparitions/ils-ont-disparu',
    description: 'navigation.disappearances.theyDisappeared.description'
  },
  {
    title: 'navigation.disappearances.searchByCountry.title',
    href: '/disparitions/recherche-par-pays',
    description: 'navigation.disappearances.searchByCountry.description'
  },
  {
    title: 'navigation.disappearances.familyNews.title',
    href: '/disparitions/actualites-familles',
    description: 'navigation.disappearances.familyNews.description'
  },
  {
    title: 'navigation.disappearances.expertAdvice.title',
    href: '/disparitions/conseils-experts',
    description: 'navigation.disappearances.expertAdvice.description'
  }
]

// Components
const Logo = () => (
  <Image src="/logos/text-icon.png" alt="Antred logo" width={154} height={45} />
)

const MenuLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children
}) => (
  <Link href={href} legacyBehavior passHref>
    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
      {children}
    </NavigationMenuLink>
  </Link>
)

const MenuContent: React.FC<{ items: MenuItem[] }> = ({ items }) => (
  <NavigationMenuContent>
    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
      {items.map((item) => (
        <ListItem key={item.title} title={item.title} href={item.href}>
          {item.description}
        </ListItem>
      ))}
    </ul>
  </NavigationMenuContent>
)

const MissionContent = () => {
  const t = useTranslations('navigation.mission')

  return (
    <NavigationMenuContent>
      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
        <li className="row-span-4">
          <NavigationMenuLink asChild>
            <a
              className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md transform transition-transform duration-300 hover:scale-105"
              href="/antred"
            >
              <Image
                src="/logos/colored-icon.png"
                alt="Antred logo"
                width={154}
                height={45}
              />
              <div className="mb-2 mt-4 text-lg font-medium">
                {t('antred.title')}
              </div>
              <p className="text-sm leading-tight">{t('antred.description')}</p>
            </a>
          </NavigationMenuLink>
        </li>

        <ListItem href="/antred#qui-sommes-nous" title={t('whoWeAre.title')}>
          {t('whoWeAre.description')}
        </ListItem>

        <ListItem href="/antred#mission" title={t('ourMission.title')}>
          {t('ourMission.description')}
        </ListItem>

        <ListItem href="/antred#equipe" title={t('team.title')}>
          {t('team.description')}
        </ListItem>

        <ListItem href="/antred#partenaires" title={t('network.title')}>
          {t('network.description')}
        </ListItem>
      </ul>
    </NavigationMenuContent>
  )
}

export const DesktopNavbar: React.FC = () => {
  const t = useTranslations('navigation')

  return (
    <nav className="pt-4 fixed flex bg-background w-full justify-center">
      <div className="inline-flex max-w-7xl w-full justify-between">
        <Logo />
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
              <MenuLink href="/helpUs">
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

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  const t = useTranslations()
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors border-cyan-900 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{t(title)}</div>
          <p className="line-clamp-2 text-sm leading-snug">{t(children)}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = 'ListItem'
