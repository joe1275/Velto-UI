'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy, Moon, Plus, Sparkles, Sun } from 'lucide-react'
import Link from 'next/link'
import type { ComponentRecord } from '@/lib/supabase'

function Preview({ component }: { component: ComponentRecord }) {
  const srcDoc = `<!doctype html><html><head><style>html,body{margin:0;min-height:100%;background:#080b16;color:#f8f7ff;font-family:Arial,sans-serif}body{display:grid;place-items:center;padding:24px;box-sizing:border-box}</style></head><body>${component.code}</body></html>`
  return <iframe title={`${component.title} live preview`} sandbox="allow-scripts" srcDoc={srcDoc} className="h-64 w-full border-0" />
}

function CodeViewer({ component }: { component: ComponentRecord }) {
  const [copied, setCopied] = useState(false)
  const code = component.code
  async function copyCode() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e19] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="rounded-md bg-white/12 px-3 py-1.5 text-xs font-semibold uppercase text-fuchsia-300">Code</span>
        <button onClick={copyCode} className="flex items-center gap-2 text-xs text-slate-300"><Copy className="size-3.5" />{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre className="max-h-48 overflow-auto p-4 text-xs leading-6 text-slate-300"><code>{code || '// No code provided'}</code></pre>
    </div>
  )
}

export function Gallery({ initialComponents }: { initialComponents: ComponentRecord[] }) {
  const [components, setComponents] = useState(initialComponents)
  const [filter, setFilter] = useState('All')
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('velto-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(savedTheme ? savedTheme === 'dark' : prefersDark)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem('velto-theme', dark ? 'dark' : 'light')
  }, [dark])
  const categories = useMemo(() => ['All', ...Array.from(new Set(components.map((item) => item.category.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))], [components])
  const filtered = useMemo(() => filter === 'All' ? components : components.filter((item) => item.category === filter), [components, filter])
  const shellClass = dark ? 'min-h-screen bg-[#090d18] text-white' : 'min-h-screen bg-[#f2f5fa] text-[#10172b]'
  const surfaceClass = dark ? 'border-white/10 bg-[#111827]' : 'border-[#dce3ed] bg-white'
  return <div className={shellClass}>
    <header className="sticky top-5 z-20 px-6 pt-5 md:px-10">
      <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border bg-gradient-to-r px-4 py-2 shadow-lg backdrop-blur-xl md:px-5 ${dark ? 'border-white/10 from-fuchsia-500/20 via-purple-500/12 to-fuchsia-400/10 shadow-black/20' : 'border-white/70 from-fuchsia-200/70 via-purple-200/55 to-fuchsia-100/45 shadow-slate-300/30'}`}>
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight"><span className="text-xl text-fuchsia-400">◇</span> Velto UI</Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-xs font-semibold text-slate-500 md:flex"><a href="#collection" className="transition-colors hover:text-fuchsia-500">Collection</a><a href="#collection" className="transition-colors hover:text-fuchsia-500">Components</a><a href="#collection" className="transition-colors hover:text-fuchsia-500">About</a></nav>
        <div className="flex items-center gap-2"><a href="https://www.buymeacoffee.com" target="_blank" rel="noreferrer" className="hidden rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-fuchsia-300/30 sm:inline-flex"><span aria-hidden="true" className="mr-1.5">◉</span> Buy Me a Coffee</a><button aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} onClick={() => setDark((current) => !current)} className={`rounded-full border p-2.5 ${dark ? 'border-white/15 text-white' : 'border-[#dce3ed] text-[#10172b]'}`}>{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button></div>
      </div>
    </header>
    <main className="mx-auto max-w-[1600px] px-8 pb-16">
      <section className="mx-auto max-w-3xl py-24 text-center"><p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-fuchsia-500">The component collection</p><h1 className="text-balance text-6xl font-black tracking-[-0.06em] md:text-8xl">Beautiful components,<br /><span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">copy &amp; ship instantly.</span></h1><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-500">Browse the collection, preview live, grab the code. Every component is crafted for modern dark-mode interfaces.</p><div className={`mx-auto mt-12 flex max-w-2xl flex-col items-center gap-5 rounded-3xl border bg-gradient-to-r p-5 shadow-lg backdrop-blur-xl sm:flex-row sm:gap-6 ${dark ? 'border-white/10 from-fuchsia-500/20 via-purple-500/12 to-fuchsia-400/10 shadow-black/20' : 'border-white/70 from-fuchsia-200/70 via-purple-200/55 to-fuchsia-100/45 shadow-slate-300/30'}`}>
        <div className="text-left">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Next milestone</p>
          <p className={`mt-1 text-lg font-bold ${dark ? 'text-white' : 'text-[#0f172a]'}`}>10 new components drop</p>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <span className="text-sm font-semibold text-slate-500">$34</span>
          <div className={`h-2 flex-1 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-slate-300/50'}`}><div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500" style={{ width: '6.8%' }} /></div>
          <span className="text-sm font-semibold text-slate-500">$500</span>
        </div>
        <a href="https://www.buymeacoffee.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-fuchsia-300/30">Support <span aria-hidden="true">↗</span></a>
      </div></section>
      <div id="collection" className="mb-8 flex flex-wrap items-center justify-between gap-4"><div className="flex gap-2">{categories.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-full border px-5 py-2.5 text-sm font-semibold ${filter === item ? 'border-fuchsia-400 bg-gradient-to-r from-fuchsia-400 to-purple-500 text-white' : 'border-[#dce3ed] bg-white text-slate-500'}`}>{item}</button>)}</div><span className="text-sm text-slate-500">{filtered.length} components</span></div>
      {filtered.length === 0 ? <div className="rounded-3xl border border-dashed border-[#cbd5e1] bg-white p-16 text-center text-slate-500">No components are available yet.</div> : <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">{filtered.map((component) => <article key={component.id} className="overflow-hidden rounded-[28px] bg-[#090d18] shadow-xl"><Preview component={component} /><div className="border-t border-white/10 p-5"><div className="mb-3 flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-300">{component.category}</p><h2 className="mt-1 text-xl font-bold text-white">{component.title}</h2></div><Sparkles className="size-5 text-fuchsia-300" /></div><p className="mb-5 text-sm leading-6 text-slate-400">{component.description}</p><CodeViewer component={component} /></div></article>)}</div>}
    </main>
  </div>
}
