import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import CapitalizePage from '../pages/CapitalizePage'

describe('CapitalizePage', () => {
  it('converts text', async () => {
    const mock = vi.spyOn(window, 'fetch').mockResolvedValue({
      json: async () => ({ result: 'Hello world.' })
    } as unknown as Response)
    render(<CapitalizePage />)
    const textarea = screen.getByLabelText('Input text')
    fireEvent.change(textarea, { target: { value: 'hello world.' } })
    const button = screen.getByText('Sentence case')
    fireEvent.click(button)
    await screen.findByText('Converted successfully')
    expect(screen.getByText('Hello world.')).toBeTruthy()
    mock.mockRestore()
  })
})