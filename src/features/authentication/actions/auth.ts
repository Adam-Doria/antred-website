'use server'

import { createServerClient } from '@/lib/supabase/server'
import { LoginFormValues } from '../schemas/auth'
import { redirect } from 'next/navigation'

export const login = async (formData: LoginFormValues) => {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signInWithPassword(formData)
  if (error) return { error: error.message }
  redirect('/admin')
}

export const logout = async () => {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) return { error: error.message }
  redirect('/login')
}
