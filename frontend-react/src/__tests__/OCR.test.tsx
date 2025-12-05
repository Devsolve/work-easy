import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup } from '@testing-library/react'
vi.mock('tesseract.js', () => ({
  default: {
    recognize: vi.fn(),
  },
}))
import Tesseract from 'tesseract.js'
import OCRPage from '../pages/OCRPage'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('OCR flow', () => {
  it('extracts text from image and populates textarea', async () => {
    const mock = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 'Extracted text' }),
    } as unknown as Response)

    const { getByLabelText, getByText, findByText } = render(<OCRPage />)
    const fileInput = getByLabelText('Image OCR') as HTMLInputElement
    const file = new File(['fake'], 'fake.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(getByText('Extract text'))
    await findByText('Image text extracted')
    expect(mock).toHaveBeenCalled()
    mock.mockRestore()
  })

  it('falls back to browser OCR when backend fails', async () => {
    const fetchMock = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'OCR unavailable' }),
    } as unknown as Response)

    const multi = 'Line 1\n\n    Indented line\nSymbols: © ™ — ✓\nEnd'
    const tessMock = (
      Tesseract.recognize as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({
      data: { text: multi },
    } as unknown as { data: { text: string } })

    const { getByLabelText, getByText, findByText } = render(<OCRPage />)
    const fileInput = getByLabelText('Image OCR') as HTMLInputElement
    const file = new File(['fake'], 'fake.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(getByText('Extract text'))
    await findByText('Image text extracted (browser OCR)')
    const ta = document.getElementById('output') as HTMLTextAreaElement
    expect(ta.value).toBe(multi)
    expect(fetchMock).toHaveBeenCalled()
    expect(tessMock).toHaveBeenCalled()
    fetchMock.mockRestore()
    tessMock.mockRestore()
  })
})
