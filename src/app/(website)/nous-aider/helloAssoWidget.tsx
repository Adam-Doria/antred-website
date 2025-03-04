'use client'
import { useEffect, useState } from 'react'

interface HelloAssoWidgetProps {
  height?: string
  className?: string
  src: string
}

export const HelloAssoWidget = ({ className, src }: HelloAssoWidgetProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')

    setIsMobile(mediaQuery.matches)

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    mediaQuery.addEventListener('change', handleResize)
    // Nettoyage à la destruction du composant
    return () => mediaQuery.removeEventListener('change', handleResize)
  }, [])

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-background"></div>
        </div>
      )}

      <iframe
        id="haWidget"
        title="Formulaire de don HelloAsso"
        src={src}
        onLoad={handleLoad}
        scrolling={isMobile ? 'auto' : 'no'}
        className={`w-full min-h-full transition-opacity duration-300 overflow-y-scroll [-ms-overflow-style:'none' [scrollbar-width:'none'] after:[&::-webkit-scrollbar]:hidden   ${className}`}
      />
    </div>
  )
}
