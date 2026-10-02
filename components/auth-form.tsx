'use client'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter(); const [error, setError] = useState(''); const [pending, setPending] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(''); setPending(true); const data = new FormData(event.currentTarget); const result = mode === 'sign-in' ? await authClient.signIn.email({ email: String(data.get('email')), password: String(data.get('password')) }) : await authClient.signUp.email({ email: String(data.get('email')), password: String(data.get('password')), name: String(data.get('name')) }); setPending(false); if (result.error) setError('We could not complete that request. Check your details and try again.'); else { router.push('/'); router.refresh() } }
  return <form onSubmit={submit} className="space-y-4"><h1 className="font-serif text-4xl">{mode === 'sign-in' ? 'Welcome back' : 'Create your account'}</h1>{mode === 'sign-up' && <input name="name" required placeholder="Full name" className="w-full border p-3" /> }<input name="email" type="email" required placeholder="Email address" className="w-full border p-3" /><input name="password" type="password" minLength={8} required placeholder="Password (8+ characters)" className="w-full border p-3" />{error && <p role="alert" className="text-sm text-[#b44e35]">{error}</p>}<button disabled={pending} className="w-full bg-[#c26742] px-5 py-3 font-bold text-white disabled:opacity-60">{pending ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</button></form>
}
