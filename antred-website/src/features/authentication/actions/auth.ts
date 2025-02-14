'use server'

import { createServerClient } from '@/lib/supabase/server'
import { LoginFormValues } from '../schemas/auth'

export const login = async (formData: LoginFormValues) => {
  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword(formData)
  console.log(error)
  if (error) return { error: error.message }

  return { success: 'succes' }
}
