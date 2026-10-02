'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function SignOutButton() {
  const router = useRouter()
  return <button onClick={async () => { await authClient.signOut(); router.replace('/') }} className="inline-flex items-center gap-2 text-sm font-bold text-[#c26742] hover:text-[#173d38]"><LogOut size={16} /> Sign out</button>
}
