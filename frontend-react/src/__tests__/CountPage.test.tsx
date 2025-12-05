import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('CountPage integration', () => {
  it('navigates via sidebar and shows counts', async () => {
    render(<App />)
    fireEvent.click(
      screen.getByRole('button', { name: 'Character & Word Count' }),
    )
    const ta = screen.getByLabelText('Analysis input') as HTMLTextAreaElement
    fireEvent.change(ta, {
      target: {
        value: 'This is a test.\nNew line here. Also tabs\twork.',
      },
    })
    const out = await screen.findByText(/Character count: \d+ \| Word count: \d+/)
    expect(out.textContent).toMatch(/Non-whitespace: \d+/)
  })
})

