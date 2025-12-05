import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders title', () => {
    render(<App />)
    const matches = screen.queryAllByText('Text Formatter')
    expect(matches.length).toBeGreaterThan(0)
  })
})
