import { describe, expect, it } from 'vitest'
import {
  clampFontSize,
  DEFAULT_FONT_SIZE,
  FONT_STEP,
  getInitialFontSize,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  FONT_SIZE_STORAGE_KEY,
} from './fontSize'

describe('clampFontSize', () => {
  it('keeps values within the allowed range', () => {
    expect(clampFontSize(MIN_FONT_SIZE)).toBe(MIN_FONT_SIZE)
    expect(clampFontSize(MAX_FONT_SIZE)).toBe(MAX_FONT_SIZE)
    expect(clampFontSize(20)).toBe(20)
  })

  it('clamps below the minimum', () => {
    expect(clampFontSize(4)).toBe(MIN_FONT_SIZE)
  })

  it('clamps above the maximum', () => {
    expect(clampFontSize(999)).toBe(MAX_FONT_SIZE)
  })

  it('rounds fractional values', () => {
    expect(clampFontSize(17.49)).toBe(17)
    expect(clampFontSize(17.5)).toBe(18)
  })

  it('falls back to default for NaN', () => {
    expect(clampFontSize(Number.NaN)).toBe(DEFAULT_FONT_SIZE)
  })
})

describe('getInitialFontSize', () => {
  it('uses default when no stored value', () => {
    expect(getInitialFontSize()).toBe(DEFAULT_FONT_SIZE)
    expect(getInitialFontSize(null)).toBe(DEFAULT_FONT_SIZE)
    expect(getInitialFontSize('')).toBe(DEFAULT_FONT_SIZE)
  })

  it('parses and clamps a stored value', () => {
    expect(getInitialFontSize('22')).toBe(22)
    expect(getInitialFontSize('1')).toBe(MIN_FONT_SIZE)
    expect(getInitialFontSize('999')).toBe(MAX_FONT_SIZE)
    expect(getInitialFontSize('abc')).toBe(DEFAULT_FONT_SIZE)
  })
})

describe('constants', () => {
  it('exposes sane range and step', () => {
    expect(MIN_FONT_SIZE).toBe(14)
    expect(MAX_FONT_SIZE).toBe(32)
    expect(FONT_STEP).toBe(2)
    expect(FONT_SIZE_STORAGE_KEY).toBe('ai-reader:font-size')
  })
})
