// import { useState, useEffect } from 'react'
import { MobileNavbar } from './MobileNavbar'
import { DesktopNavbar } from './DesktopNavbar'

export const Navbar: React.FC = () => {
  // const [isMobile, setIsMobile] = useState(false)

  // useEffect(() => {
  //   const checkMobile = () => {
  //     setIsMobile(window.innerWidth < 1024)
  //   }

  //   checkMobile()
  //   window.addEventListener('resize', checkMobile)

  //   return () => {
  //     window.removeEventListener('resize', checkMobile)
  //   }
  // }, [])

  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
    </>
  )
}
