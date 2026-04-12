"use server"

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function loginWithPassword(formData: FormData) {
  const supabase = await createClient()
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    redirect('/login?message=Email ou senha incorretos')
  }

  return redirect('/admin')
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (data?.url) {
    redirect(data.url)
  }

  if (error) {
     redirect('/login?message=Could not authenticate with Google')
  }
}
