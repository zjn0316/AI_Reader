import { splitIntoParagraphs } from './fileLoader'

export interface DesktopOpenResult {
  name: string
  content: string
}

export interface DesktopApi {
  openTxtFile: () => Promise<DesktopOpenResult | { error: string } | null>
}

declare global {
  interface Window {
    desktop?: DesktopApi
  }
}

export interface OpenedBook {
  name: string
  paragraphs: string[]
}

export function hasDesktopApi(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.desktop?.openTxtFile === 'function'
  )
}

export function toBook(result: DesktopOpenResult): OpenedBook {
  return {
    name: result.name,
    paragraphs: splitIntoParagraphs(result.content),
  }
}

export async function openBookViaDesktop(): Promise<OpenedBook | null> {
  if (!hasDesktopApi()) return null

  const result = await window.desktop!.openTxtFile()
  if (result == null) return null
  if ('error' in result) throw new Error(result.error)
  return toBook(result)
}
