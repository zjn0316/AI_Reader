import { describe, expect, it } from 'vitest'
import {
  hasTxtExtension,
  splitIntoParagraphs,
  TXT_EXTENSION,
} from './fileLoader'

describe('hasTxtExtension', () => {
  it('accepts a lowercase txt file', () => {
    expect(hasTxtExtension('novel.txt')).toBe(true)
  })

  it('accepts an uppercase txt file', () => {
    expect(hasTxtExtension('NOVEL.TXT')).toBe(true)
  })

  it('accepts mixed case and whitespace', () => {
    expect(hasTxtExtension('   My Book.Txt   ')).toBe(true)
  })

  it('rejects non-txt files', () => {
    expect(hasTxtExtension('novel.pdf')).toBe(false)
    expect(hasTxtExtension('novel.epub')).toBe(false)
  })
})

describe('TXT_EXTENSION', () => {
  it('is the txt extension', () => {
    expect(TXT_EXTENSION).toBe('txt')
  })
})

describe('splitIntoParagraphs', () => {
  it('splits text by newlines and trims each line', () => {
    const result = splitIntoParagraphs('  hello  \nworld\n  foo bar ')
    expect(result).toEqual(['hello', 'world', 'foo bar'])
  })

  it('removes empty lines', () => {
    const result = splitIntoParagraphs('a\n\n\n  \nb')
    expect(result).toEqual(['a', 'b'])
  })

  it('handles CRLF line endings', () => {
    const result = splitIntoParagraphs('a\r\nb\r\nc')
    expect(result).toEqual(['a', 'b', 'c'])
  })

  it('returns an empty array for blank input', () => {
    expect(splitIntoParagraphs('')).toEqual([])
    expect(splitIntoParagraphs('   \n\n')).toEqual([])
  })
})
