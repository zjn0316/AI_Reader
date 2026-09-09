import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReaderView } from './ReaderView'

describe('ReaderView', () => {
  it('renders all paragraphs', () => {
    render(<ReaderView paragraphs={['第一段', '第二段', '第三段']} fontSize={18} />)
    expect(screen.getByText('第一段')).toBeInTheDocument()
    expect(screen.getByText('第二段')).toBeInTheDocument()
    expect(screen.getByText('第三段')).toBeInTheDocument()
  })

  it('applies the provided font size', () => {
    render(<ReaderView paragraphs={['hello']} fontSize={24} />)
    const view = screen.getByTestId('reader-view')
    expect(view).toHaveStyle({ fontSize: '24px' })
  })

  it('renders nothing for empty paragraphs', () => {
    render(<ReaderView paragraphs={[]} fontSize={18} />)
    expect(screen.getByTestId('reader-view')).toBeInTheDocument()
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })
})
