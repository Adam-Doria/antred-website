import {
  UserSearch,
  Newspaper,
  // Bell,
  // Settings,
  LayoutDashboard
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { AdminSidebarFooter } from './AdminSidebarFooter'

export function AdminSidebar() {
  // Groupes de menus pour organiser les éléments
  const dashboardItems = [
    {
      title: 'Dashboard (in progress)',
      url: '/admin',
      icon: LayoutDashboard
    }
    //,
    // {
    //   title: 'Dernières alertes',
    //   url: '/admin/alerts',
    //   icon: Bell
    // }
  ]

  const contentItems = [
    {
      title: 'Disparitions',
      url: '/admin/disparition',
      icon: UserSearch
    },
    {
      title: 'Articles (in progress)',
      url: '/admin/articles',
      icon: Newspaper
    }
  ]

  // const settingsItems = [
  //   {
  //     title: 'Paramètres',
  //     url: '/admin/settings',
  //     icon: Settings
  //   }
  // ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tableau de bord</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Groupe Contenu */}
        <SidebarGroup>
          <SidebarGroupLabel>Contenu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Groupe Paramètres */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      {/* Footer avec infos utilisateur */}
      <AdminSidebarFooter />
    </Sidebar>
  )
}
