import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Highlighter,
  Brain,
  Zap,
} from 'lucide-react'
import type { Document, SourceCitation } from '../../types'
import { renderPdfPage } from '../../services/pdf'

interface ContextPanelProps {
  open: boolean
  onClose: () => void
  document?: Document
  currentPage: number
  onPageChange: (page: number) => void
  activeCitation?: SourceCitation
  embedded?: boolean
}

export function ContextPanel({
  open,
  onClose,
  document,
  currentPage,
  onPageChange,
  activeCitation,
  embedded = false,
}: ContextPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rendering, setRendering] = useState(false)

  const totalPages = document?.pages ?? 0
  const hasFile = document?.file && document.status === 'ready'

  useEffect(() => {
    if (!hasFile || !canvasRef.current || !open) return
    let cancelled = false
    setRendering(true)
    renderPdfPage(document.file!, currentPage, canvasRef.current, 1.1)
      .catch(() => {})
      .finally(() => { if (!cancelled) setRendering(false) })
    return () => { cancelled = true }
  }, [document?.file, currentPage, hasFile, open])

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ width: 0, opacity: 0, x: 20 }}
          animate={{ width: embedded ? '100%' : 380, opacity: 1, x: 0 }}
          exit={{ width: 0, opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className={`${embedded ? 'flex' : 'hidden xl:flex'} glass-strong glow-neural relative z-20 h-full shrink-0 flex-col overflow-hidden rounded-2xl`}
          style={{ width: embedded ? '100%' : 380 }}
        >
          <div className="relative border-b border-white/5 px-4 py-4">
            <div className="absolute inset-0 bg-gradient-to-r from-neural-600/10 to-cyan-glow/5" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-glow/10">
                  <BookOpen className="h-4 w-4 text-cyan-glow" />
                </div>
                <div>
                  <span className="text-sm font-medium">Context Engine</span>
                  <p className="text-[10px] text-text-muted">Live document intelligence</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-muted hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </motion.button>
            </div>
          </div>

          {document && (
            <div className="border-b border-white/5 px-4 py-2">
              <p className="truncate text-xs text-neural-300">{document.name}</p>
            </div>
          )}

          {!hasFile ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <Brain className="h-12 w-12 text-text-muted/50" />
              <p className="text-sm text-text-secondary">Select a document to activate context preview</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                <div className="flex items-center gap-1">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="rounded-lg p-1.5 text-text-muted hover:text-white disabled:opacity-30">
                    <ChevronLeft size={16} />
                  </motion.button>
                  <span className="px-2 font-mono text-xs text-cyan-glow">{currentPage} / {totalPages}</span>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="rounded-lg p-1.5 text-text-muted hover:text-white disabled:opacity-30">
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-text-muted">
                  <Zap className="h-3 w-3 text-neural-400" />
                  Indexed
                </div>
              </div>

              <div className="relative flex-1 overflow-auto p-4">
                {rendering && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-void/60 backdrop-blur-sm">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-8 w-8 rounded-full border-2 border-neural-500 border-t-transparent" />
                  </div>
                )}
                <motion.div
                  key={`${document.id}-${currentPage}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mx-auto w-fit overflow-hidden rounded-xl shadow-2xl ring-1 ${activeCitation ? 'ring-cyan-glow/50 glow-cyan' : 'ring-white/10'}`}
                >
                  <canvas ref={canvasRef} className="block max-w-full bg-white" />
                </motion.div>
              </div>

              <AnimatePresence>
                {activeCitation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5"
                  >
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-cyan-glow">
                        <Highlighter size={14} />
                        Referenced source
                      </div>
                      <div className="glass-ai rounded-xl p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-cyan-glow">p.{activeCitation.page}</span>
                          <span className="text-[10px] text-text-muted">{Math.round(activeCitation.confidence * 100)}% confidence</span>
                        </div>
                        <p className="text-xs italic text-text-secondary">"{activeCitation.excerpt}"</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
