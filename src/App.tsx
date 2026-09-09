import { useCallback, useState } from 'react'
import './App.css'
import { ReaderView } from './components/ReaderView'
import { useFontSize } from './hooks/useFontSize'
import {
  hasTxtExtension,
  readTxtFile,
  splitIntoParagraphs,
} from './lib/fileLoader'
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from './lib/fontSize'

type LoadError = 'not-txt' | 'read-failed' | null

function App() {
  const [paragraphs, setParagraphs] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<LoadError>(null)
  const { fontSize, increase, decrease } = useFontSize()

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return

    if (!hasTxtExtension(file.name)) {
      setError('not-txt')
      return
    }

    try {
      const raw = await readTxtFile(file)
      const parts = splitIntoParagraphs(raw)
      setParagraphs(parts)
      setFileName(file.name)
      setError(null)
    } catch {
      setError('read-failed')
    }
  }, [])

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      void handleFile(file)
      event.target.value = ''
    },
    [handleFile],
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>马克阅读</h1>
        <p className="subtitle">本地 TXT 电子书阅读器</p>
      </header>

      <div className="toolbar">
        <label className="open-label">
          打开 TXT 文件
          <input
            type="file"
            accept=".txt,text/plain"
            aria-label="选择要打开的 TXT 文件"
            onChange={handleFileChange}
          />
        </label>

        <div className="font-controls" role="group" aria-label="字号调节">
          <button type="button" onClick={decrease} disabled={fontSize <= MIN_FONT_SIZE}>
            A−
          </button>
          <span className="font-size" data-testid="font-size-label" data-value={fontSize}>
            {fontSize}px
          </span>
          <button type="button" onClick={increase} disabled={fontSize >= MAX_FONT_SIZE}>
            A+
          </button>
        </div>
      </div>

      {error === 'not-txt' && (
        <p className="error" role="alert">
          仅支持 .txt 文件，请重新选择。
        </p>
      )}
      {error === 'read-failed' && (
        <p className="error" role="alert">
          文件读取失败，请重试。
        </p>
      )}

      {fileName ? (
        <ReaderView paragraphs={paragraphs} fontSize={fontSize} />
      ) : (
        <div className="empty-state">
          <p>暂未打开书籍。</p>
          <p>点击上方「打开 TXT 文件」导入一本电子书开始阅读。</p>
        </div>
      )}
    </div>
  )
}

export default App
