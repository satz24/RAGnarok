import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, ChevronDown, User, ExternalLink, Sparkles } from 'lucide-react'
import type { Message, SourceCitation } from '../../types'

interface MessageBubbleProps {
  message: Message
  onSourceClick?: (citation: SourceCitation) => void
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part ? <span key={`${keyPrefix}-t-${i}`}>{part}</span> : null
  })
}

function renderMarkdown(text: string) {
  if (!text.trim()) return null

  const blocks = text.split(/\n\n+/)

  return blocks.map((block, blockIdx) => {
    const lines = block.split('\n').filter((l) => l.trim())
    if (lines.length === 0) return null

    const isBulletList = lines.every((l) => /^[*-]\s+/.test(l.trim()))
    const isNumberedList = lines.every((l) => /^\d+\.\s+/.test(l.trim()))

    if (isBulletList) {
      return (
        <ul key={blockIdx} className="mb-5 space-y-4 last:mb-0">
          {lines.map((line, i) => (
            <li key={i} className="flex gap-3.5">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-cyan-glow/90 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
              <span className="flex-1">{renderInline(line.trim().replace(/^[*-]\s+/, ''), `${blockIdx}-${i}`)}</span>
            </li>
          ))}
        </ul>
      )
    }

    if (isNumberedList) {
      return (
        <ol key={blockIdx} className="mb-5 list-decimal space-y-4 pl-6 last:mb-0 marker:font-bold marker:text-neural-400">
          {lines.map((line, i) => (
            <li key={i} className="pl-2">
              {renderInline(line.trim().replace(/^\d+\.\s+/, ''), `${blockIdx}-${i}`)}
            </li>
          ))}
        </ol>
      )
    }

    return (
      <div key={blockIdx} className="mb-5 space-y-4 last:mb-0">
        {lines.map((line, i) => {
          const trimmed = line.trim()
          if (/^[*-]\s+/.test(trimmed)) {
            return (
              <div key={i} className="flex gap-3.5">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-cyan-glow/90 shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                <span className="flex-1">{renderInline(trimmed.replace(/^[*-]\s+/, ''), `${blockIdx}-${i}`)}</span>
              </div>
            )
          }
          if (/^#{1,3}\s+/.test(trimmed)) {
            const level = trimmed.match(/^#+/)![0].length
            const content = trimmed.replace(/^#+\s+/, '')
            const className =
              level === 1
                ? 'font-display text-lg font-bold text-white md:text-xl'
                : 'font-display text-base font-bold text-white md:text-lg'
            return (
              <p key={i} className={`${className} mt-2 first:mt-0`}>
                {renderInline(content, `${blockIdx}-h-${i}`)}
              </p>
            )
          }
          if (/^\d+\.\s+/.test(trimmed)) {
            return (
              <p key={i} className="pl-2">
                {renderInline(trimmed, `${blockIdx}-n-${i}`)}
              </p>
            )
          }
          return (
            <p key={i}>{renderInline(trimmed, `${blockIdx}-p-${i}`)}</p>
          )
        })}
      </div>
    )
  })
}

export function MessageBubble({ message, onSourceClick }: MessageBubbleProps) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false)
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="flex justify-end gap-3"
      >
        <div className="max-w-[75%] md:max-w-[60%]">
          <div className="rounded-2xl rounded-tr-md bg-neural-600/80 px-5 py-3.5 text-white">
            <div className="text-sm leading-relaxed">{message.content}</div>
          </div>
          <div className="mt-1.5 flex justify-end">
            <span className="text-[10px] text-text-muted">{formatTime(message.timestamp)}</span>
          </div>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <User className="h-4 w-4 text-text-secondary" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex w-full gap-3"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neural-500/25 to-violet-glow/25 ring-1 ring-neural-500/20">
        <Bot className="h-4 w-4 text-neural-400" />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={`relative overflow-hidden rounded-2xl rounded-tl-md px-7 py-6 md:px-10 md:py-8 ${
            message.error
              ? 'border border-red-500/20 bg-red-500/5 backdrop-blur-xl'
              : 'glass-ai'
          }`}
        >
          {!message.error && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: message.isStreaming ? 2 : 0, repeat: message.isStreaming ? Infinity : 0, ease: 'linear' }}
              />
            </div>
          )}

          {!message.error && message.id !== 'welcome' && (
            <div className="mb-5 flex items-center gap-2 border-b border-white/10 pb-4">
              <Sparkles className="h-4 w-4 text-cyan-glow" />
              <span className="text-xs font-bold tracking-widest text-neural-200 uppercase">
                RAGnarok
              </span>
            </div>
          )}

          <div className="ai-message-body relative text-[15px] leading-[1.9] text-white/95 md:text-base md:leading-[1.95]">
            {renderMarkdown(message.content)}
            {message.isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-[typing-cursor_1s_ease-in-out_infinite] bg-neural-400" />
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 px-1">
          <span className="text-[10px] text-text-muted">{formatTime(message.timestamp)}</span>
          {message.confidence && (
            <span className="flex items-center gap-1 text-[10px] text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              {Math.round(message.confidence * 100)}% confidence
            </span>
          )}
        </div>

        {message.sources && message.sources.length > 0 && !message.isStreaming && (
          <div className="mt-3 px-1">
            <button
              onClick={() => setSourcesExpanded(!sourcesExpanded)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-cyan-glow hover:bg-cyan-glow/10"
            >
              <ExternalLink size={12} />
              {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
              <ChevronDown
                size={12}
                className={`transition-transform ${sourcesExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {sourcesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 grid gap-2 overflow-hidden sm:grid-cols-2"
                >
                  {message.sources.map((source) => (
                    <motion.button
                      key={source.id}
                      type="button"
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => onSourceClick?.(source)}
                      className="glass block w-full rounded-xl p-3 text-left transition-colors hover:border-cyan-glow/30"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {source.documentName && (
                            <span className="max-w-[140px] truncate rounded bg-neural-500/10 px-2 py-0.5 text-[10px] text-neural-300">
                              {source.documentName}
                            </span>
                          )}
                          <span className="rounded bg-cyan-glow/10 px-2 py-0.5 font-mono text-[10px] text-cyan-glow">
                            p.{source.page}
                          </span>
                        </div>
                        <span className="shrink-0 text-[10px] text-text-muted">
                          {Math.round(source.confidence * 100)}% match
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-text-secondary italic">
                        "{source.excerpt}"
                      </p>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  )
}
