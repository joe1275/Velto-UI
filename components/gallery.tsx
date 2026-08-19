'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy, Moon, Sun, ArrowLeft, Eye, Code2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { ComponentRecord } from '@/lib/supabase'

// ─── Tag badge colours (minimal, muted) ──────────────────────────────────────
const TAG_STYLES: Record<string, string> = {
  CSS: 'bg-sky-50 text-sky-600 border-sky-200',
  JS: 'bg-amber-50 text-amber-600 border-amber-200',
  ANIMATION: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200',
}
const DEFAULT_TAG = 'bg-slate-50 text-slate-500 border-slate-200'

function TagBadge({ tag }: { tag: string }) {
  const normalised = tag.trim().toUpperCase()
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${TAG_STYLES[normalised] ?? DEFAULT_TAG}`}>
      {tag.trim()}
    </span>
  )
}

// ─── Live preview iframe ──────────────────────────────────────────────────────
function Preview({ component, tall = false }: { component: ComponentRecord; tall?: boolean }) {
  const srcDoc = `<!doctype html><html><head><style>html,body{margin:0;min-height:100%;background:#080b16;color:#f8f7ff;font-family:Arial,sans-serif}body{display:grid;place-items:center;padding:24px;box-sizing:border-box}</style></head><body>${component.code}</body></html>`
  return (
    <iframe
      title={`${component.title} live preview`}
      sandbox="allow-scripts"
      srcDoc={srcDoc}
      className={`w-full border-0 ${tall ? 'h-[480px]' : 'h-64'}`}
    />
  )
}

// ─── Code viewer (detail page only) ──────────────────────────────────────────
function CodeBlock({ component }: { component: ComponentRecord }) {
  return (
    <pre className="h-[480px] overflow-auto bg-[#0b0e19] p-6 text-xs leading-6 text-slate-300">
      <code>{component.code || '// No code provided'}</code>
    </pre>
  )
}

// ─── Single component detail view ────────────────────────────────────────────
function ComponentDetail({
  component,
  dark,
  setDark,
  onBack,
}: {
  component: ComponentRecord
  dark: boolean
  setDark: (v: boolean) => void
  onBack: () => void
}) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    await navigator.clipboard.writeText(component.code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <div className={dark ? 'min-h-screen bg-[#090d18] text-white' : 'min-h-screen bg-[#f2f5fa] text-[#10172b]'}>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b px-6 py-3 backdrop-blur-xl md:px-10"
        style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', background: dark ? 'rgba(9,13,24,0.85)' : 'rgba(242,245,250,0.85)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          {/* Left: breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <button
              onClick={onBack}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-fuchsia-400 hover:text-fuchsia-500 ${dark ? 'border-white/15 text-slate-300' : 'border-slate-200 text-slate-500 bg-white'}`}
            >
              <ArrowLeft className="size-3.5" />
              Gallery
            </button>
            <span className={dark ? 'text-white/30' : 'text-slate-300'}>/</span>
            <span className={`text-sm font-semibold ${dark ? 'text-white' : 'text-[#10172b]'}`}>{component.title}</span>
          </div>
          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://www.buymeacoffee.com"
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-fuchsia-300/30 sm:inline-flex"
            >
              <span aria-hidden="true" className="mr-1.5">◉</span> Buy Me a Coffee
            </a>
            <button
              aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
              onClick={() => setDark(!dark)}
              className={`rounded-full border p-2.5 ${dark ? 'border-white/15 text-white' : 'border-slate-200 bg-white text-[#10172b]'}`}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        {/* Tab bar + Copy */}
        <div className={`mb-0 flex items-center justify-between rounded-t-2xl border px-4 py-2 ${dark ? 'border-white/10 bg-[#111827]' : 'border-slate-200 bg-white'}`}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab('preview')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${tab === 'preview' ? (dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-[#10172b]') : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Eye className="size-3.5" />
              Preview
            </button>
            <button
              onClick={() => setTab('code')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${tab === 'code' ? (dark ? 'bg-white/10 text-white' : 'bg-slate-100 text-[#10172b]') : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Code2 className="size-3.5" />
              Code
            </button>
          </div>
          <button
            onClick={copyCode}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${dark ? 'border-white/10 text-slate-300 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'}`}
          >
            <Copy className="size-3.5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Content area */}
        <div className={`overflow-hidden rounded-b-2xl border border-t-0 ${dark ? 'border-white/10' : 'border-slate-200'}`}>
          {tab === 'preview' ? <Preview component={component} tall /> : <CodeBlock component={component} />}
        </div>

        {/* Back button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onBack}
            className={`rounded-full border px-6 py-3 text-sm font-semibold transition-colors hover:border-fuchsia-400 hover:text-fuchsia-500 ${dark ? 'border-white/15 bg-white/5 text-white' : 'border-slate-200 bg-white text-slate-600 shadow-sm'}`}
          >
            ← Back to All Components
          </button>
        </div>
      </main>
    </div>
  )
}

// ─── Gallery card ─────────────────────────────────────────────────────────────
function GalleryCard({
  component,
  dark,
  onClick,
}: {
  component: ComponentRecord
  dark: boolean
  onClick: () => void
}) {
  return (
    <article
      onClick={onClick}
      className={`group cursor-pointer overflow-hidden rounded-[28px] shadow-md transition-shadow hover:shadow-xl ${dark ? 'bg-[#0e1120]' : 'bg-white'}`}
    >
      {/* Live preview */}
      <div className="overflow-hidden rounded-t-[28px] bg-[#090d18]">
        <Preview component={component} />
      </div>

      {/* Info section */}
      <div className={`p-5 ${dark ? 'bg-[#111827]' : 'bg-white'}`}>
        {/* Category badge */}
        {component.category && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            <TagBadge tag={component.category} />
          </div>
        )}

        {/* Title + icon */}
        <div className="flex items-start justify-between gap-2">
          <h2 className={`text-base font-bold leading-snug ${dark ? 'text-white' : 'text-[#10172b]'}`}>
            {component.title}
          </h2>
          <Sparkles className="mt-0.5 size-4 shrink-0 text-fuchsia-400" />
        </div>

        {/* Description */}
        {component.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-slate-400 line-clamp-2">
            {component.description}
          </p>
        )}
      </div>
    </article>
  )
}

// ─── Main Gallery export ──────────────────────────────────────────────────────
export function Gallery({ initialComponents }: { initialComponents: ComponentRecord[] }) {
  const [components] = useState(initialComponents)
  const [filter, setFilter] = useState('All')
  const [dark, setDark] = useState(false)
  const [selected, setSelected] = useState<ComponentRecord | null>(null)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('velto-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(savedTheme ? savedTheme === 'dark' : prefersDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem('velto-theme', dark ? 'dark' : 'light')
  }, [dark])

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(components.map((c) => c.category.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b))],
    [components],
  )

  const filtered = useMemo(
    () => (filter === 'All' ? components : components.filter((c) => c.category === filter)),
    [components, filter],
  )

  // ── Detail view ──
  if (selected) {
    return (
      <ComponentDetail
        component={selected}
        dark={dark}
        setDark={setDark}
        onBack={() => setSelected(null)}
      />
    )
  }

  // ── Gallery view ──
  const shellClass = dark ? 'min-h-screen bg-[#090d18] text-white' : 'min-h-screen bg-[#f2f5fa] text-[#10172b]'

  return (
    <div className={shellClass}>
      {/* Header */}
      <header className="sticky top-5 z-20 px-6 pt-5 md:px-10">
        <div className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border bg-gradient-to-r px-4 py-2 shadow-lg backdrop-blur-xl md:px-5 ${dark ? 'border-white/10 from-fuchsia-500/20 via-purple-500/12 to-fuchsia-400/10 shadow-black/20' : 'border-white/70 from-fuchsia-200/70 via-purple-200/55 to-fuchsia-100/45 shadow-slate-300/30'}`}>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="text-xl text-fuchsia-400">◇</span> Velto UI
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-xs font-semibold text-slate-500 md:flex">
            <a href="#collection" className="transition-colors hover:text-fuchsia-500">Collection</a>
            <a href="#collection" className="transition-colors hover:text-fuchsia-500">Components</a>
            <a href="#collection" className="transition-colors hover:text-fuchsia-500">About</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="https://www.buymeacoffee.com"
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-fuchsia-300/30 sm:inline-flex"
            >
              <span aria-hidden="true" className="mr-1.5">◉</span> Buy Me a Coffee
            </a>
            <button
              aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
              onClick={() => setDark((c) => !c)}
              className={`rounded-full border p-2.5 ${dark ? 'border-white/15 text-white' : 'border-[#dce3ed] text-[#10172b]'}`}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 pb-16">
        {/* Hero */}
        <section className="mx-auto max-w-3xl py-24 text-center">
          <h1 className="text-balance text-6xl font-black tracking-[-0.06em] md:text-8xl">
            Beautiful components,<br />
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
              copy &amp; ship instantly.
            </span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-500">
            Browse the collection, preview live, grab the code. Every component is crafted for modern dark-mode interfaces.
          </p>
          <div className={`mx-auto mt-12 flex max-w-2xl flex-col items-center gap-5 rounded-3xl border bg-gradient-to-r p-5 shadow-lg backdrop-blur-xl sm:flex-row sm:gap-6 ${dark ? 'border-white/10 from-fuchsia-500/20 via-purple-500/12 to-fuchsia-400/10 shadow-black/20' : 'border-white/70 from-fuchsia-200/70 via-purple-200/55 to-fuchsia-100/45 shadow-slate-300/30'}`}>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Next milestone</p>
              <p className={`mt-1 text-lg font-bold ${dark ? 'text-white' : 'text-[#0f172a]'}`}>10 new components drop</p>
            </div>
            <div className="flex flex-1 items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">$34</span>
              <div className={`h-2 flex-1 overflow-hidden rounded-full ${dark ? 'bg-white/10' : 'bg-slate-300/50'}`}>
                <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500" style={{ width: '6.8%' }} />
              </div>
              <span className="text-sm font-semibold text-slate-500">$500</span>
            </div>
            <a
              href="https://www.buymeacoffee.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-fuchsia-300/30"
            >
              Support <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        {/* Filter bar */}
        <div id="collection" className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${filter === cat ? 'border-fuchsia-400 bg-gradient-to-r from-fuchsia-400 to-purple-500 text-white' : dark ? 'border-white/10 bg-white/5 text-slate-400 hover:text-white' : 'border-[#dce3ed] bg-white text-slate-500 hover:text-slate-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <span className="text-sm text-slate-500">{filtered.length} components</span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className={`rounded-3xl border border-dashed p-16 text-center text-slate-500 ${dark ? 'border-white/10 bg-white/5' : 'border-[#cbd5e1] bg-white'}`}>
            No components are available yet.
          </div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((component) => (
              <GalleryCard
                key={component.id}
                component={component}
                dark={dark}
                onClick={() => setSelected(component)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
