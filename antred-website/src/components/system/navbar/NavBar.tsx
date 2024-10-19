import { MobileNavbar } from './MobileNavbar'
import { DesktopNavbar } from './DesktopNavbar'

export const Navbar: React.FC = () => {
  return (
    <>
      <MobileNavbar />
      <DesktopNavbar />
    </>
  )
}
