import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { Message, Document, SourceCitation } from '../../types'
import { hasApiKey } from '../../lib/apiKey'
import { MessageBubble } from './MessageBubble'
import { ThinkingIndicator } from './ThinkingIndicator'
import { ChatInput } from './ChatInput'

interface ChatAreaProps {
  messages: Message[]
  isThinking: boolean
  selectedDocuments: Document[]
  onSend: (message: string) => void
  onSourceClick: (citation: SourceCitation) => void
}

const SUGGESTIONS_SINGLE = ['Summarize this document', 'What are the main topics covered?', 'List the key findings']
const SUGGESTIONS_MULTI = ['Summarize all selected documents', 'Compare topics across documents', 'What are the key differences?']

export function ChatArea({
  messages,
  isThinking,
  selectedDocuments,
  onSend,
  onSourceClick,
}: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasSelection = selectedDocuments.length > 0
  const apiKeyConfigured = hasApiKey()
  const isMulti = selectedDocuments.length > 1
  const suggestions = isMulti ? SUGGESTIONS_MULTI : SUGGESTIONS_SINGLE

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  return (
    <div className="relative flex h-full flex-col">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neural-500/40 to-transparent" />

      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <motion.div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neural-500/20 to-cyan-glow/10 ring-1 ring-neural-500/20"
            animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.3)', '0 0 0px rgba(99,102,241,0)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-4 w-4 text-neural-400" />
          </motion.div>
          <div className="min-w-0">
            <h2 className="font-display text-sm font-semibold tracking-wide text-white">Neural Interface</h2>
            <p className="truncate text-xs text-text-muted">
              {hasSelection
                ? isMulti ? `${selectedDocuments.length} documents synchronized` : selectedDocuments[0].name
                : 'Awaiting document ingestion'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`hidden rounded-full px-3 py-1 text-[10px] md:inline ${apiKeyConfigured ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}
          >
            {apiKeyConfigured ? '● Gemini Online' : '● Key Required'}
          </motion.span>
        </div>
      </div>

      {isMulti && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="flex gap-2 overflow-x-auto border-b border-white/5 px-4 py-2"
        >
          {selectedDocuments.map((doc, i) => (
            <motion.span
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0 rounded-lg bg-neural-500/10 px-2.5 py-1 text-[10px] text-neural-300 ring-1 ring-neural-500/20"
            >
              {doc.name.length > 22 ? doc.name.slice(0, 20) + '…' : doc.name}
            </motion.span>
          ))}
        </motion.div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          {!apiKeyConfigured && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-200/90">
              Add <code className="rounded bg-white/10 px-1 font-mono text-xs">VITE_GEMINI_API_KEY</code> to <code className="rounded bg-white/10 px-1 font-mono text-xs">.env.local</code> and restart.
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div key={message.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <MessageBubble message={message} onSourceClick={onSourceClick} />
              </motion.div>
            ))}
          </AnimatePresence>

          {hasSelection && messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSend(suggestion)}
                  disabled={!apiKeyConfigured || isThinking}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-text-secondary transition-colors hover:border-neural-500/30 hover:text-white disabled:opacity-40"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}

          <AnimatePresence>{isThinking && <ThinkingIndicator />}</AnimatePresence>
        </div>
      </div>

      <ChatInput
        onSend={onSend}
        disabled={isThinking || !hasSelection || !apiKeyConfigured}
        placeholder={
          !apiKeyConfigured ? 'Configure Gemini API key...'
            : !hasSelection ? 'Select PDFs in the sidebar...'
            : isMulti ? `Query ${selectedDocuments.length} documents...`
            : 'Ask your neural assistant...'
        }
      />
    </div>
  )
}
