import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const devServerUrl = process.env.VITE_DEV_SERVER_URL

export interface OpenTxtResult {
  name: string
  content: string
}

export async function openTxtFile(): Promise<OpenTxtResult | null> {
  const result = await dialog.showOpenDialog({
    title: '打开 TXT 文件',
    properties: ['openFile'],
    filters: [
      { name: '文本文件', extensions: ['txt'] },
      { name: '所有文件', extensions: ['*'] },
    ],
  })

  if (result.canceled || result.filePaths.length === 0) return null

  const filePath = result.filePaths[0]
  const content = await readFile(filePath, 'utf8')
  return { name: path.basename(filePath), content }
}

function registerIpcHandlers(): void {
  ipcMain.handle('open-txt-file', async () => {
    try {
      return await openTxtFile()
    } catch (error) {
      return { error: (error as Error).message }
    }
  })
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1000,
    height: 760,
    minWidth: 640,
    minHeight: 480,
    title: '马克阅读',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (devServerUrl) {
    void win.loadURL(devServerUrl)
  } else {
    void win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
