import { z } from 'zod'

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email({ message: t('auth.form.errors.invalidEmail') }),
    password: z.string().min(8, {
      message: t('auth.form.errors.passwordLength')
    })
  })

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>
