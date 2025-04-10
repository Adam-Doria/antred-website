import {
  UserSearch,
  Settings,
  BookOpen,
  LayoutDashboard,
  GraduationCap,
  Megaphone
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@/components/ui/sidebar'
import { AdminSidebarFooter } from './AdminSidebarFooter'

export function AdminSidebar() {
  const ADMIN_ARTICLE_CATEGORIES = [
    {
      name: `Paroles d'experts`,
      slug: 'paroles-dexperts',
      icon: GraduationCap
    },
    { name: 'Conseils Pratiques', slug: 'conseils-pratiques', icon: BookOpen },
    {
      name: `Actualités de l'Antred`,
      slug: 'actualites-de-lantred',
      icon: Megaphone
    }
  ]

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
      url: '/admin/disparitions',
      icon: UserSearch
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarGroupLabel>Articles</SidebarGroupLabel>

                <SidebarMenu>
                  {ADMIN_ARTICLE_CATEGORIES.map((category) => (
                    <SidebarMenuItem key={category.slug}>
                      <SidebarMenuSubButton asChild>
                        <a href={`/admin/articles/${category.slug}`}>
                          <category.icon className="h-4 w-4 mr-2" />
                          <span>{category.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuItem>
                  ))}

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <a href="/admin/articles/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Paramètres</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AdminSidebarFooter />
    </Sidebar>
  )
}
