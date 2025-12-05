import { describe, it, expect } from 'vitest'
import { countStats, graphemes } from '../utils/count'

describe('count utilities', () => {
  it('handles empty input', () => {
    const s = countStats('')
    expect(s.chars).toBe(0)
    expect(s.words).toBe(0)
    expect(s.charsNoWhitespace).toBe(0)
  })

  it('counts words across mixed whitespace', () => {
    const s = countStats('Hello   world\nthis is\tfine')
    expect(s.words).toBe(5)
  })

  it('unicode visible characters: emoji and accents', () => {
    const str = '👍🏽 café'
    const g = graphemes(str)
    expect(g[0]).toMatch(/👍/)
    const s = countStats(str)
    expect(s.words).toBe(2)
    expect(s.chars).toBeGreaterThan(2)
    expect(s.charsNoWhitespace).toBe(s.chars - 1)
  })

  it('punctuation included in character count', () => {
    const s = countStats('Hello, world!')
    expect(s.chars).toBeGreaterThan(0)
  })
})

