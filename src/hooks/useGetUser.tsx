'use client'

import { createBrowserClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'

export function useGetUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        const {
          data: { user }
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error('Erreur récupération utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return {
    user,
    loading,
    displayName:
      user?.user_metadata?.display_name ||
      user?.email?.split('@')[0] ||
      'Utilisateur',
    email: user?.email
  }
}
