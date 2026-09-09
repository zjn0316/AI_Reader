export const TXT_EXTENSION = 'txt' as const

export function hasTxtExtension(fileName: string): boolean {
  const normalized = fileName.trim().toLowerCase()
  return normalized.endsWith(`.${TXT_EXTENSION}`)
}

export async function readTxtFile(file: File): Promise<string> {
  return file.text()
}

export function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}
