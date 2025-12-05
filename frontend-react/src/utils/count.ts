export function graphemes(input: string): string[] {
  try {
    type SegmenterCtor = new (
      locales?: string | string[] | undefined,
      options?: { granularity?: 'grapheme' | 'word' | 'sentence' },
    ) => { segment: (s: string) => Iterable<{ segment: string }> }
    const Seg = (Intl as unknown as { Segmenter?: SegmenterCtor }).Segmenter
    if (typeof Seg === 'function') {
      const seg = new Seg(undefined, { granularity: 'grapheme' })
      const iter = seg.segment(input)
      const out: string[] = []
      for (const s of iter) out.push(s.segment)
      return out
    }
  } catch {
    // ignore
  }
  return Array.from(input)
}

export function countStats(input: string): {
  chars: number
  words: number
  charsNoWhitespace: number
} {
  const segs = graphemes(input)
  const chars = segs.length
  const charsNoWhitespace = segs.filter((s) => !/\s/u.test(s)).length
  const trimmed = input.trim()
  const words = trimmed ? trimmed.split(/\s+/u).filter(Boolean).length : 0
  return { chars, words, charsNoWhitespace }
}
