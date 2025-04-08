'use client'

import { useGetUser } from '@/hooks/useGetUser'
import { SidebarFooter } from '@/components/ui/sidebar'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/features/authentication/actions/auth'

export function AdminSidebarFooter() {
  const { displayName } = useGetUser()

  const handleLogout = async () => {
    console.log('log out')
    await logout()
  }

  return (
    <SidebarFooter className="border-t p-2">
      <div className={`flex items-center  justify-between`}>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>

          <p className="text-sm font-medium truncate max-w-[150px]">
            {displayName}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Se déconnecter"
            className="h-8 w-8"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </SidebarFooter>
  )
}
