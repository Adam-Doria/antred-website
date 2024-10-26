'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('notFound')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = 'visible'
    }
  }, [])

  return (
    <div className="relative flex items-center justify-center  min-h-screen overflow-hidden bg-gradient-to-b from-[#FFFAF7] via-[#F2EDEB] to-brand-700 animate-gradient-x md:-mx-[50%]">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(228, 46, 71, 0.1) 0%, transparent 50%)`
        }}
      />
      <div className="text-center z-10">
        <motion.h1
          className="text-9xl font-extrabold text-[#30554E] mb-8 relative"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="absolute top-0 left-0 ml-1 text-[#E42E47] animate-glitch-1">
            404
          </span>
          <span className="opacity-0">404</span>
          <span className="absolute top-0 left-0 ml-2 text-[#30554E] animate-glitch-2">
            404
          </span>
        </motion.h1>
        <motion.p
          className="text-2xl text-[#434343] mb-8 w-full p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {t('text')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/" passHref>
            <button className="px-8 py-3 text-lg font-semibold text-white bg-[#30554E] rounded-full hover:bg-[#E42E47] transition-colors duration-300 transform hover:scale-105">
              {t('button')}
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
