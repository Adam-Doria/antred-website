'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const t = useTranslations('common')
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only"> {t('toggleTheme')}</span>
    </Button>
  )
}
