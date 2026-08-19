'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { authenticateAdmin, createAdminComponent } from './actions'

type ComponentForm = { title: string; description: string; category: string; code: string }
const emptyForm: ComponentForm = { title: '', description: '', category: '', code: '' }

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [authStatus, setAuthStatus] = useState('')
  const [status, setStatus] = useState('')
  const [form, setForm] = useState<ComponentForm>(emptyForm)
  function update(key: keyof ComponentForm, value: string) { setForm((current) => ({ ...current, [key]: value })) }
  async function unlock(event: FormEvent) {
    event.preventDefault(); setAuthStatus('Checking...')
    const result = await authenticateAdmin(passcode)
    if (!result.ok) { setAuthStatus(result.message); return }
    setAuthorized(true); setAuthStatus(''); setPasscode('')
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus('Saving...')
    const result = await createAdminComponent({ title: form.title, description: form.description, category: form.category, code: form.code })
    if (result.error) { setStatus(`Could not save: ${result.error}`); return }
    setForm(emptyForm); setStatus('Component saved. It is now live in the gallery.')
  }
  if (!authorized) return <main className="grid min-h-screen place-items-center bg-[#f2f5fa] px-6 text-[#10172b]"><form onSubmit={unlock} className="w-full max-w-md rounded-[32px] border border-[#dce3ed] bg-white p-8 shadow-xl"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft className="size-4" /> Back to gallery</Link><p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-500">Admin studio</p><h1 className="mt-3 text-3xl font-black tracking-tight">Enter admin passcode</h1><p className="mt-3 text-slate-500">This area is restricted to authorized editors.</p><label className="mt-7 grid gap-2 text-sm font-semibold">Passcode<input required type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="rounded-xl border border-[#dce3ed] px-4 py-3 font-normal outline-none focus:border-fuchsia-400" autoComplete="current-password" /></label>{authStatus && <p role="alert" className="mt-3 text-sm text-rose-600">{authStatus}</p>}<button type="submit" className="mt-6 w-full rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-5 py-3 font-bold text-white">Continue</button></form></main>
  return <main className="min-h-screen bg-[#f2f5fa] px-6 py-10 text-[#10172b]"><div className="mx-auto max-w-4xl"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft className="size-4" /> Back to gallery</Link><div className="rounded-[32px] border border-[#dce3ed] bg-white p-7 shadow-sm md:p-10"><p className="text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-500">Admin studio</p><h1 className="mt-3 text-4xl font-black tracking-tight">Add a component</h1><p className="mt-3 text-slate-500">Insert a live component into the Supabase Components table.</p><form onSubmit={submit} className="mt-8 grid gap-5"><div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-semibold">Title<input required value={form.title} onChange={(e) => update('title', e.target.value)} className="rounded-xl border border-[#dce3ed] px-4 py-3 font-normal outline-none focus:border-fuchsia-400" /></label><label className="grid gap-2 text-sm font-semibold">Category<input required value={form.category} onChange={(e) => update('category', e.target.value)} className="rounded-xl border border-[#dce3ed] px-4 py-3 font-normal outline-none focus:border-fuchsia-400" placeholder="e.g. Buttons, Forms, Navbars" /></label></div><label className="grid gap-2 text-sm font-semibold">Description<input required value={form.description} onChange={(e) => update('description', e.target.value)} className="rounded-xl border border-[#dce3ed] px-4 py-3 font-normal outline-none focus:border-fuchsia-400" /></label><label className="grid gap-2 text-sm font-semibold">Code<textarea value={form.code} onChange={(e) => update('code', e.target.value)} rows={12} className="rounded-xl border border-[#dce3ed] bg-[#0b0e19] p-4 font-mono text-sm font-normal text-slate-200 outline-none focus:border-fuchsia-400" placeholder="Paste your component code" /></label><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-5 py-3 font-bold text-white">Save component <CheckCircle2 className="size-4" /></button>{status && <p role="status" className="text-sm text-slate-500">{status}</p>}</form></div></div></main>
}
