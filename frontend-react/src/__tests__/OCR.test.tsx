import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import CapitalizePage from '../pages/CapitalizePage'

describe('OCR flow', () => {
  it('extracts text from image and populates textarea', async () => {
    const mock = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 'Extracted text' })
    } as unknown as Response)

    render(<CapitalizePage />)
    const fileInput = screen.getByLabelText('Image OCR') as HTMLInputElement
    const file = new File(['fake'], 'fake.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })
    fireEvent.click(screen.getByText('Extract text'))
    await screen.findByText('Image text extracted')
    expect(mock).toHaveBeenCalled()
    mock.mockRestore()
  })
})

