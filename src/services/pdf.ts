import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const MAX_TEXT_CHARS = 80_000

export async function getPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  return pdf.numPages
}

export async function extractPdfText(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const parts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim()
    if (text) parts.push(`[Page ${i}]\n${text}`)
  }

  let fullText = parts.join('\n\n')
  if (fullText.length > MAX_TEXT_CHARS) {
    fullText =
      fullText.slice(0, MAX_TEXT_CHARS) +
      '\n\n[Document truncated due to length — only the first portion was indexed.]'
  }
  return fullText
}

export async function renderPdfPage(
  file: File,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale = 1.2,
): Promise<void> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale })

  canvas.width = viewport.width
  canvas.height = viewport.height

  const context = canvas.getContext('2d')
  if (!context) return

  await page.render({ canvasContext: context, viewport, canvas }).promise
}
