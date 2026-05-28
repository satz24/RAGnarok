import { GoogleGenerativeAI } from '@google/generative-ai'
import type { DocumentContext, Message, SourceCitation } from '../types'

const MODELS = [
  import.meta.env.VITE_GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
].filter(Boolean) as string[]

const MAX_TOTAL_CHARS = 80_000

const SYSTEM_INSTRUCTION = `You are RAGnarok, an AI document research assistant. Answer questions based ONLY on the provided document text.

Rules:
- Be precise and cite page numbers AND document names when referencing specific information
- When multiple documents are provided, clearly indicate which document each fact comes from
- Use markdown formatting for clarity (bold, lists, etc.)
- If the answer is not in the documents, say so clearly
- At the very end of your response, on its own line, append citations in this exact format:
CITATIONS: [{"document": "filename.pdf", "page": 1, "excerpt": "relevant quote", "confidence": 0.95}]`

function buildDocumentsBlock(documents: DocumentContext[]): string {
  const perDocLimit = Math.max(2000, Math.floor(MAX_TOTAL_CHARS / documents.length))

  return documents
    .map((doc) => {
      let text = doc.text
      if (text.length > perDocLimit) {
        text = text.slice(0, perDocLimit) + '\n[Document truncated due to length]'
      }
      return `=== Document: "${doc.name}" ===\n${text}`
    })
    .join('\n\n')
}

function parseCitations(text: string, documents: DocumentContext[]): { content: string; sources: SourceCitation[] } {
  const marker = 'CITATIONS:'
  const idx = text.lastIndexOf(marker)
  if (idx === -1) return { content: text.trim(), sources: [] }

  const content = text.slice(0, idx).trim()
  const jsonPart = text.slice(idx + marker.length).trim()

  const nameToId = new Map(documents.map((d) => [d.name.toLowerCase(), d.id]))

  try {
    const parsed = JSON.parse(jsonPart) as Array<{
      document?: string
      page: number
      excerpt: string
      confidence?: number
    }>
    const sources: SourceCitation[] = parsed.map((s, i) => {
      const docName = s.document ?? documents[0]?.name ?? 'Unknown'
      return {
        id: String(i + 1),
        page: s.page,
        excerpt: s.excerpt,
        confidence: s.confidence ?? 0.85,
        documentId: nameToId.get(docName.toLowerCase()) ?? documents[0]?.id,
        documentName: docName,
      }
    })
    return { content, sources }
  } catch {
    return { content: text.trim(), sources: [] }
  }
}

function buildHistory(messages: Message[]) {
  return messages
    .filter((m) => m.id !== 'welcome' && m.content && !m.error)
    .slice(0, -1)
    .map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.content }],
    }))
}

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function formatGeminiError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)

  if (isQuotaError(err)) {
    return `**Gemini rate limit reached.** The free tier quota for this model is exhausted.

**What you can do:**
1. Wait 1–2 minutes and try again
2. Enable billing in [Google AI Studio](https://aistudio.google.com/)
3. Create a new API key if this one has no remaining free quota

Tip: Select fewer PDFs in the sidebar to reduce token usage.`
  }

  if (msg.includes('API key') || msg.includes('401') || msg.includes('403')) {
    return '**Invalid Gemini API key.** Check **VITE_GEMINI_API_KEY** in `.env.local` and verify it is active in [Google AI Studio](https://aistudio.google.com/apikey).'
  }

  if (msg.length > 300) {
    return `**Request failed.** ${msg.slice(0, 280)}…`
  }

  return `**Request failed.** ${msg}`
}

async function sendWithRetry(
  model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
  history: ReturnType<typeof buildHistory>,
  prompt: string,
) {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const chat = model.startChat({ history })
      return await chat.sendMessageStream(prompt)
    } catch (err) {
      lastError = err
      if (isQuotaError(err) && attempt < 2) {
        await sleep(2000 * (attempt + 1))
        continue
      }
      throw err
    }
  }
  throw lastError
}

export async function* streamChatWithDocuments(
  apiKey: string,
  documents: DocumentContext[],
  messages: Message[],
  userMessage: string,
): AsyncGenerator<{ type: 'chunk'; text: string } | { type: 'done'; content: string; sources: SourceCitation[] }> {
  const validDocs = documents.filter((d) => d.text.trim())
  if (validDocs.length === 0) {
    throw new Error(
      'No readable text found in the selected PDFs. They may be scanned images — try text-based PDFs.',
    )
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const history = buildHistory([
    ...messages,
    { id: 'temp', role: 'user', content: userMessage, timestamp: new Date() },
  ])

  const includeDocuments = buildHistory(messages).length === 0
  const docBlock = buildDocumentsBlock(validDocs)

  const prompt = includeDocuments
    ? validDocs.length === 1
      ? `Document: "${validDocs[0].name}"\n\n${validDocs[0].text.length > MAX_TOTAL_CHARS ? validDocs[0].text.slice(0, MAX_TOTAL_CHARS) + '\n[truncated]' : validDocs[0].text}\n\n---\n\nQuestion: ${userMessage}`
      : `You have ${validDocs.length} documents to analyze:\n\n${docBlock}\n\n---\n\nQuestion: ${userMessage}`
    : userMessage

  let lastError: unknown

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
      })

      const result = await sendWithRetry(model, history, prompt)

      let fullText = ''
      for await (const chunk of result.stream) {
        const text = chunk.text()
        fullText += text
        yield { type: 'chunk', text }
      }

      const { content, sources } = parseCitations(fullText, validDocs)
      yield { type: 'done', content, sources }
      return
    } catch (err) {
      lastError = err
      if (isQuotaError(err)) continue
      throw err
    }
  }

  throw lastError ?? new Error('All Gemini models failed. Check your API quota.')
}

// Keep backward-compatible export name
export const streamChatWithDocument = streamChatWithDocuments
