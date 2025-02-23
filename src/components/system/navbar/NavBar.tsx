import { MobileNavbar } from './MobileNavbar'
import { DesktopNavbar } from './DesktopNavbar'

export const Navbar: React.FC = () => {
  return (
    <div className="z-50 fixed top-0 left-0 right-0 bg-background">
      <MobileNavbar />
      <DesktopNavbar />
    </div>
  )
}
