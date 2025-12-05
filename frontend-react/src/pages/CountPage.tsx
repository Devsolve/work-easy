import { useEffect, useMemo, useRef, useState } from 'react'
import { countStats } from '../utils/count'

export default function CountPage() {
  const [text, setText] = useState('')
  const [display, setDisplay] = useState(
    'Character count: 0 | Word count: 0 | Non-whitespace: 0',
  )
  const latest = useRef('')
  const timer = useRef<number | null>(null)
  const debouncedUpdate = useMemo(
    () => (value: string) => {
      latest.current = value
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        const { chars, words, charsNoWhitespace } = countStats(latest.current)
        const base = `Character count: ${chars} | Word count: ${words}`
        const extra = ` | Non-whitespace: ${charsNoWhitespace}`
        setDisplay(base + extra)
      }, 120)
    },
    [],
  )

  useEffect(() => {
    debouncedUpdate(text)
  }, [text, debouncedUpdate])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">
        Character & Word Count
      </h1>
      <div className="bg-white rounded border shadow-sm p-4 space-y-4">
        <div>
          <label
            htmlFor="analysis-input"
            className="block text-sm font-medium text-slate-700"
          >
            Text for analysis
          </label>
          <textarea
            id="analysis-input"
            aria-label="Analysis input"
            placeholder="Enter 3–4 sentences..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={() => debouncedUpdate(text)}
            className="mt-1 w-full min-h-40 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div
          id="analysis-output"
          aria-live="polite"
          className="mt-1 w-full min-h-12 p-3 border rounded bg-slate-50 text-slate-800"
        >
          {display}
        </div>
      </div>
    </div>
  )
}
