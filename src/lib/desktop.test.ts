import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  hasDesktopApi,
  openBookViaDesktop,
  toBook,
  type DesktopApi,
} from './desktop'

function installDesktopApi(api: Partial<DesktopApi>): void {
  window.desktop = api as DesktopApi
}

afterEach(() => {
  delete window.desktop
})

describe('hasDesktopApi', () => {
  it('is false when no desktop bridge is present', () => {
    expect(hasDesktopApi()).toBe(false)
  })

  it('is true when the bridge exposes openTxtFile', () => {
    installDesktopApi({ openTxtFile: vi.fn() })
    expect(hasDesktopApi()).toBe(true)
  })

  it('is false when openTxtFile is not a function', () => {
    window.desktop = { openTxtFile: undefined } as unknown as DesktopApi
    expect(hasDesktopApi()).toBe(false)
  })
})

describe('toBook', () => {
  it('splits content into paragraphs and keeps the file name', () => {
    const book = toBook({ name: 'a.txt', content: '第一段\n\n第二段' })
    expect(book.name).toBe('a.txt')
    expect(book.paragraphs).toEqual(['第一段', '第二段'])
  })
})

describe('openBookViaDesktop', () => {
  it('returns null when there is no desktop bridge', async () => {
    await expect(openBookViaDesktop()).resolves.toBeNull()
  })

  it('returns null when the user cancels', async () => {
    installDesktopApi({ openTxtFile: vi.fn().mockResolvedValue(null) })
    await expect(openBookViaDesktop()).resolves.toBeNull()
  })

  it('returns a parsed book on success', async () => {
    installDesktopApi({
      openTxtFile: vi.fn().mockResolvedValue({
        name: 'novel.txt',
        content: '甲\n乙',
      }),
    })
    await expect(openBookViaDesktop()).resolves.toEqual({
      name: 'novel.txt',
      paragraphs: ['甲', '乙'],
    })
  })

  it('throws when the bridge returns an error', async () => {
    installDesktopApi({
      openTxtFile: vi.fn().mockResolvedValue({ error: 'boom' }),
    })
    await expect(openBookViaDesktop()).rejects.toThrow('boom')
  })
})
