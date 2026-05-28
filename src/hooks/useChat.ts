import { useState, useCallback, useEffect, useMemo } from 'react'
import type { Document, Message } from '../types'
import { getApiKey } from '../lib/apiKey'
import { streamChatWithDocuments, formatGeminiError } from '../services/gemini'

function selectionKey(docs: Document[]) {
  return docs.map((d) => d.id).sort().join(',')
}

function welcomeMessage(allSelected: Document[], readySelected: Document[]): Message {
  if (allSelected.length === 0) {
    return {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to RAGnarok. Upload one or more PDFs, select them in the sidebar, then ask questions across all selected documents.',
      timestamp: new Date(),
    }
  }

  const processing = allSelected.filter((d) => d.status === 'processing')
  if (processing.length > 0 && readySelected.length === 0) {
    return {
      id: 'welcome',
      role: 'assistant',
      content: `Processing ${processing.length} document(s)... I'll be ready once indexing completes.`,
      timestamp: new Date(),
    }
  }

  if (readySelected.length === 1) {
    const doc = readySelected[0]
    return {
      id: 'welcome',
      role: 'assistant',
      content: `**${doc.name}** is ready (${doc.pages} pages). Ask me anything — answers include page citations.`,
      timestamp: new Date(),
    }
  }

  const names = readySelected.map((d) => `**${d.name}** (${d.pages} pg)`).join(', ')
  return {
    id: 'welcome',
    role: 'assistant',
    content: `${readySelected.length} documents selected for chat: ${names}. Ask questions across all of them — I'll cite the source document and page.`,
    timestamp: new Date(),
  }
}

export function useChat(allSelectedDocuments: Document[], readySelectedDocuments: Document[]) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage([], [])])
  const [isThinking, setIsThinking] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  const docKey = useMemo(() => selectionKey(allSelectedDocuments), [allSelectedDocuments])

  useEffect(() => {
    setMessages([welcomeMessage(allSelectedDocuments, readySelectedDocuments)])
  }, [docKey, readySelectedDocuments.length])

  const clearChat = useCallback(() => {
    setMessages([welcomeMessage(allSelectedDocuments, readySelectedDocuments)])
  }, [allSelectedDocuments, readySelectedDocuments])

  const sendMessage = useCallback(
    async (content: string) => {
      const apiKey = getApiKey()
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          { id: `user-${Date.now()}`, role: 'user', content, timestamp: new Date() },
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: 'No Gemini API key found. Add **VITE_GEMINI_API_KEY** to your `.env.local` file and restart the server.',
            timestamp: new Date(),
            error: true,
          },
        ])
        return
      }

      const readyDocs = readySelectedDocuments

      if (readyDocs.length === 0) {
        setMessages((prev) => [
          ...prev,
          { id: `user-${Date.now()}`, role: 'user', content, timestamp: new Date() },
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: allSelectedDocuments.length === 0
              ? 'Select at least one PDF in the sidebar (checkbox) before asking questions.'
              : 'Selected PDFs are still processing or have no readable text.',
            timestamp: new Date(),
            error: true,
          },
        ])
        return
      }

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsThinking(true)

      const assistantId = `assistant-${Date.now()}`

      try {
        setIsThinking(false)
        setStreamingMessageId(assistantId)
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
          },
        ])

        const docContexts = readyDocs.map((d) => ({
          id: d.id,
          name: d.name,
          text: d.extractedText!,
        }))

        let streamedContent = ''
        for await (const event of streamChatWithDocuments(apiKey, docContexts, messages, content)) {
          if (event.type === 'chunk') {
            streamedContent += event.text
            const display = streamedContent.replace(/CITATIONS:\s*\[[\s\S]*$/, '').trim()
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: display } : m))
            )
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? {
                      ...m,
                      content: event.content,
                      sources: event.sources,
                      confidence: event.sources.length > 0 ? 0.9 : undefined,
                      isStreaming: false,
                    }
                  : m
              )
            )
          }
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== assistantId),
          {
            id: assistantId,
            role: 'assistant',
            content: formatGeminiError(err),
            timestamp: new Date(),
            error: true,
            isStreaming: false,
          },
        ])
      } finally {
        setIsThinking(false)
        setStreamingMessageId(null)
      }
    },
    [allSelectedDocuments, readySelectedDocuments, messages]
  )

  return { messages, isThinking, streamingMessageId, sendMessage, clearChat }
}
