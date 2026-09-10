import { contextBridge, ipcRenderer } from 'electron'

export interface OpenTxtResult {
  name: string
  content: string
}

export interface DesktopApi {
  openTxtFile: () => Promise<OpenTxtResult | { error: string } | null>
}

const desktopApi: DesktopApi = {
  openTxtFile: () => ipcRenderer.invoke('open-txt-file'),
}

contextBridge.exposeInMainWorld('desktop', desktopApi)
