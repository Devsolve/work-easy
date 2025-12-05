import { useEffect, useRef, useState } from 'react'
import Tesseract from 'tesseract.js'
import { API_BASE_URL } from '../constants'

type Props = { onSendToFormatter?: (text: string) => void }

export default function OCRPage({ onSendToFormatter }: Props) {
  const [text, setText] = useState('')
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

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

  useEffect(() => {
    const ta = taRef.current
    if (ta) {
      ta.style.height = 'auto'
      ta.style.height = `${ta.scrollHeight}px`
    }
  }, [text])

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
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
    window.addEventListener('paste', handler as unknown as EventListener)
    return () =>
      window.removeEventListener('paste', handler as unknown as EventListener)
  }, [])

  useEffect(() => {
    if (imageFile && typeof URL !== 'undefined' && 'createObjectURL' in URL) {
      const U = URL as unknown as {
        createObjectURL: (f: File) => string
        revokeObjectURL: (u: string) => void
      }
      const url = U.createObjectURL(imageFile)
      setPreviewUrl(url)
      return () => {
        if ('revokeObjectURL' in URL) {
          U.revokeObjectURL(url)
        }
      }
    }
    if (!imageFile) setPreviewUrl(null)
  }, [imageFile])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">
        Image to Text
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
          {imageFile && (
            <div className="mt-2 text-xs text-slate-600">
              Selected: {imageFile.name}
            </div>
          )}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 h-20 rounded border object-contain bg-slate-100"
            />
          )}
          <div className="mt-2 flex items-center gap-2">
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
                  if (!res.ok || !data?.result) {
                    const recognized = await Tesseract.recognize(
                      imageFile,
                      'eng',
                      {
                        logger: () => {},
                      },
                    )
                    const localText = recognized?.data?.text ?? ''
                    if (!localText) throw new Error(data?.error || 'OCR failed')
                    setText(localText)
                    setSuccess('Image text extracted (browser OCR)')
                  } else {
                    setText(typeof data.result === 'string' ? data.result : '')
                    setSuccess('Image text extracted')
                  }
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
            {imageFile && (
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-slate-200 text-slate-800 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Clear image
              </button>
            )}
            {!!text && onSendToFormatter && (
              <button
                type="button"
                onClick={() => onSendToFormatter(text)}
                className="inline-flex items-center px-3 py-1.5 text-sm rounded bg-violet-600 text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400"
              >
                Open in Text Formatter
              </button>
            )}
          </div>
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
            Extracted Text
          </label>
          <textarea
            id="output"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-slate-400"
            ref={taRef}
            style={{ overflow: 'auto', resize: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
