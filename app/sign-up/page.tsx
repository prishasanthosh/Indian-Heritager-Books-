import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'
export default function SignUpPage() { return <main className="grid min-h-screen place-items-center bg-[#f8f5ee] p-6"><div className="w-full max-w-md space-y-6 bg-[#fbfaf6] p-8 shadow-sm"><AuthForm mode="sign-up" /><p className="text-sm text-[#59645f]">Already have an account? <Link className="font-bold text-[#c26742]" href="/sign-in">Sign in</Link></p><Link href="/" className="text-sm font-bold text-[#183d38]">← Back to shop</Link></div></main> }
