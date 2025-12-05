import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import CapitalizePage from '../pages/CapitalizePage'

describe('Paste image', () => {
  it('pastes image and extracts text', async () => {
    const mock = vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 'Extracted from paste' }),
    } as unknown as Response)

    render(<CapitalizePage />)
    const pasteArea = screen.getByText('Paste image here (Ctrl+V)')
    const file = new File(['fake'], 'clip.png', { type: 'image/png' })
    const clipboardData = {
      items: [{ kind: 'file', type: 'image/png', getAsFile: () => file }],
    } as unknown as ClipboardEvent['clipboardData']
    fireEvent.paste(pasteArea, { clipboardData })
    fireEvent.click(screen.getByText('Extract text'))
    await screen.findByText('Image text extracted')
    expect(mock).toHaveBeenCalled()
    mock.mockRestore()
  })
})
