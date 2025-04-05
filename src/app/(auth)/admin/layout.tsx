import { SidebarProvider } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/sidebar/AdminSidebar'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        {children}
      </SidebarProvider>
    </div>
  )
}
