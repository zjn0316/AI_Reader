import { useCallback, useState } from 'react'
import {
  clampFontSize,
  DEFAULT_FONT_SIZE,
  FONT_SIZE_STORAGE_KEY,
  FONT_STEP,
  getInitialFontSize,
} from '../lib/fontSize'

function readStoredFontSize(): number {
  if (typeof window === 'undefined') return DEFAULT_FONT_SIZE
  return getInitialFontSize(window.localStorage.getItem(FONT_SIZE_STORAGE_KEY))
}

export interface FontSizeControls {
  fontSize: number
  increase: () => void
  decrease: () => void
  reset: () => void
}

export function useFontSize(): FontSizeControls {
  const [fontSize, setFontSize] = useState<number>(readStoredFontSize)

  const update = useCallback((next: number) => {
    const clamped = clampFontSize(next)
    setFontSize(clamped)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, String(clamped))
    }
  }, [])

  const increase = useCallback(() => update(fontSize + FONT_STEP), [fontSize, update])
  const decrease = useCallback(() => update(fontSize - FONT_STEP), [fontSize, update])
  const reset = useCallback(() => update(DEFAULT_FONT_SIZE), [update])

  return { fontSize, increase, decrease, reset }
}
