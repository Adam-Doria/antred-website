// src/app/(auth)/admin/articles/settings/page.tsx
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { createServerClient } from '@/lib/supabase/server'
import { getAllCategories } from '@/features/articles/actions/queries/getCategories'
import { getAllTags } from '@/features/articles/actions/queries/getTags'
import { SettingsListEditor } from '@/features/articles/component/SettingsListEditor'

export const dynamic = 'force-dynamic'

// Récupérer l'ID autorisé depuis les variables d'environnement
const AUTHORIZED_USER_ID_FOR_CATEGORIES =
  process.env.NEXT_PUBLIC_AUTHORIZED_CATEGORY_MANAGER_ID || ''

async function ArticleSettingsPage() {
  const supabase = await createServerClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const currentUserId = user?.id

  const canManageCategories =
    !AUTHORIZED_USER_ID_FOR_CATEGORIES ||
    currentUserId === AUTHORIZED_USER_ID_FOR_CATEGORIES

  const [initialCategories, initialTags] = await Promise.all([
    getAllCategories(),
    getAllTags()
  ])

  return (
    <div className="space-y-8 p-4 w-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Paramètres des Articles</h1>
        <p className="text-secondary-foreground">
          Gérez les catégories et les tags utilisés pour les articles.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
        <SettingsListEditor
          items={initialCategories}
          entityType="category"
          canManage={canManageCategories}
        />
      </Suspense>

      <hr className="my-6" />

      <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
        <SettingsListEditor
          items={initialTags}
          entityType="tag"
          canManage={true}
        />
      </Suspense>
    </div>
  )
}
export default ArticleSettingsPage
