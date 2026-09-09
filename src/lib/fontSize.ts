export const MIN_FONT_SIZE = 14
export const MAX_FONT_SIZE = 32
export const DEFAULT_FONT_SIZE = 18
export const FONT_STEP = 2
export const FONT_SIZE_STORAGE_KEY = 'ai-reader:font-size'

export function clampFontSize(value: number): number {
  if (Number.isNaN(value)) return DEFAULT_FONT_SIZE
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, Math.round(value)))
}

export function getInitialFontSize(storedValue?: string | null): number {
  if (storedValue == null || storedValue.trim() === '') return DEFAULT_FONT_SIZE
  const parsed = Number(storedValue)
  return clampFontSize(parsed)
}
