import { useState } from 'react'
import { API_BASE_URL } from '../constants'
import { fetchJson } from '../utils'

export default function CapitalizePage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items
    if (items && items.length) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        if (it.kind === 'file' && it.type.startsWith('image/')) {
          const f = it.getAsFile()
          if (f) setImageFile(f)
          return
        }
      }
    }
    const files = e.clipboardData?.files
    if (files && files.length) {
      const f = files[0]
      if (f && f.type.startsWith('image/')) setImageFile(f)
    }
  }

  const convert = async (mode?: string) => {
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const endpoint = mode
        ? `${API_BASE_URL}/api/format`
        : `${API_BASE_URL}/api/capitalize`
      const body = mode ? { text, mode } : { text }
      const res = await fetchJson(endpoint, { method: 'POST', body })
      setResult(res.result || '')
      setSuccess('Converted successfully')
    } catch (e) {
      setError('Failed to convert')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">
        Change Text Format
      </h1>
      <div className="bg-white rounded border shadow-sm p-4 space-y-4">
        <div onPaste={handlePaste}>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-slate-700"
          >
            Image OCR
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm"
          />
          <div
            tabIndex={0}
            className="mt-2 w-full rounded border border-dashed border-slate-300 p-3 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Paste image here (Ctrl+V)
          </div>
          <div className="mt-2">
            <button
              onClick={async () => {
                if (!imageFile) {
                  setError('Please select an image')
                  return
                }
                setLoading(true)
                setError('')
                setSuccess('')
                try {
                  const fd = new FormData()
                  fd.append('image', imageFile)
                  const res = await fetch(`${API_BASE_URL}/api/ocr`, {
                    method: 'POST',
                    body: fd,
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data?.error || 'OCR failed')
                  setText(data.result || '')
                  setSuccess('Image text extracted')
                } catch (e) {
                  setError('Failed to extract text from image')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-slate-700 text-white hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
            >
              Extract text
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="input"
            className="block text-sm font-medium text-slate-700"
          >
            Input
          </label>
          <textarea
            id="input"
            aria-label="Input text"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full min-h-40 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>
        <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap overflow-x-auto">
          <button
            onClick={() => convert('lowercase')}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            Lowercase
          </button>
          <button
            onClick={() => convert('uppercase')}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
          >
            UPPERCASE
          </button>
          <button
            onClick={() => convert('sentence')}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-orange-600 text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
          >
            Sentence case
          </button>
          <button
            onClick={() => convert('capitalize')}
            disabled={loading}
            className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
          >
            Capitalize
          </button>
          {loading && (
            <span className="text-slate-600 text-sm">Processing...</span>
          )}
        </div>
        {success && (
          <div role="status" className="text-green-700">
            {success}
          </div>
        )}
        {error && (
          <div role="alert" className="text-red-700">
            {error}
          </div>
        )}
        <div>
          <label
            htmlFor="output"
            className="block text-sm font-medium text-slate-700"
          >
            Result
          </label>
          <div
            id="output"
            aria-live="polite"
            className="mt-1 w-full min-h-24 p-3 border rounded bg-slate-50"
          >
            {result}
          </div>
        </div>
      </div>
    </div>
  )
}
