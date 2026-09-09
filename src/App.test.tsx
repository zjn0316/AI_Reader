import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { FONT_SIZE_STORAGE_KEY } from './lib/fontSize'

function makeFile(name: string, content: string): File {
  const file = new File([content], name, { type: 'text/plain' })
  Object.defineProperty(file, 'text', {
    value: () => Promise.resolve(content),
  })
  return file
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('App', () => {
  it('shows an empty state before any file is opened', () => {
    render(<App />)
    expect(screen.getByText('暂未打开书籍。')).toBeInTheDocument()
    expect(screen.queryByTestId('reader-view')).not.toBeInTheDocument()
  })

  it('rejects non-txt files with an error message', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('选择要打开的 TXT 文件')
    await user.upload(input, makeFile('book.pdf', 'content'))
    expect(screen.getByRole('alert')).toHaveTextContent('仅支持 .txt 文件')
    expect(screen.queryByTestId('reader-view')).not.toBeInTheDocument()
  })

  it('loads a txt file and renders its paragraphs', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('选择要打开的 TXT 文件')
    await user.upload(input, makeFile('novel.txt', '第一段\n第二段\n\n第三段'))
    expect(screen.getByTestId('reader-view')).toBeInTheDocument()
    expect(screen.getByText('第一段')).toBeInTheDocument()
    expect(screen.getByText('第二段')).toBeInTheDocument()
    expect(screen.getByText('第三段')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('increases and decreases the font size and persists it', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('选择要打开的 TXT 文件')
    await user.upload(input, makeFile('novel.txt', '内容'))

    const label = screen.getByTestId('font-size-label')
    expect(label).toHaveTextContent('18px')

    await user.click(screen.getByRole('button', { name: 'A+' }))
    expect(label).toHaveTextContent('20px')
    expect(window.localStorage.getItem(FONT_SIZE_STORAGE_KEY)).toBe('20')

    await user.click(screen.getByRole('button', { name: 'A−' }))
    expect(label).toHaveTextContent('18px')
    expect(window.localStorage.getItem(FONT_SIZE_STORAGE_KEY)).toBe('18')
  })

  it('restores a persisted font size on load', () => {
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, '22')
    render(<App />)
    const label = screen.getByTestId('font-size-label')
    expect(label).toHaveTextContent('22px')
  })

  it('applies the font size to the reader view', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('选择要打开的 TXT 文件')
    await user.upload(input, makeFile('novel.txt', '内容'))

    await user.click(screen.getByRole('button', { name: 'A+' }))

    const view = screen.getByTestId('reader-view')
    expect(view).toHaveStyle({ fontSize: '20px' })
    const controls = screen.getByRole('group', { name: '字号调节' })
    expect(within(controls).getByText('20px')).toBeInTheDocument()
  })
})
