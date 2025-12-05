import { useState } from 'react'

type Props = { onSelect: (key: string) => void }

export default function Sidebar({ onSelect }: Props) {
  const [open, setOpen] = useState(true)
  return (
    <aside className="h-full bg-slate-50 border-r border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="text-sm font-medium text-slate-700">Navigation</span>
        <button
          aria-label="Toggle navigation"
          className="px-2 py-1 rounded hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '−' : '+'}
        </button>
      </div>
      {open && (
        <nav className="px-4 py-3">
          <button
            className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-violet-600 text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
            onClick={() => onSelect('format')}
          >
            Text Formatter
          </button>
          <div className="h-2" />
          <button
            className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-slate-700 text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
            onClick={() => onSelect('ocr')}
          >
            Image to Text (OCR)
          </button>
        </nav>
      )}
    </aside>
  )
}
