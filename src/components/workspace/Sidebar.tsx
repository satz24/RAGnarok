import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Search,
  Upload,
  Check,
} from 'lucide-react'
import type { Document } from '../../types'
import { Logo } from '../ui/Logo'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  documents: Document[]
  selectedDocumentIds: string[]
  onToggleSelection: (id: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
  onUploadClick: () => void
}

export function Sidebar({
  collapsed,
  onToggle,
  documents,
  selectedDocumentIds,
  onToggleSelection,
  onSelectAll,
  onDeselectAll,
  onUploadClick,
}: SidebarProps) {
  const readyCount = documents.filter((d) => d.status === 'ready').length

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="glass-strong glow-neural relative z-20 flex h-full shrink-0 flex-col overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-center justify-between border-b border-white/5 p-4">
        {!collapsed && <Logo size="sm" animated={false} />}
        {collapsed && <Logo size="sm" showText={false} animated={false} />}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-white/5 hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="border-b border-white/5 p-3">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="w-full rounded-xl border border-white/5 bg-white/[0.03] py-2 pr-3 pl-9 text-sm text-white placeholder:text-text-muted focus:border-neural-500/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between px-2">
                  <span className="text-xs font-medium tracking-wider text-text-muted uppercase">
                    Documents
                    {selectedDocumentIds.length > 0 && (
                      <span className="ml-1 text-neural-400">({selectedDocumentIds.length} in chat)</span>
                    )}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onUploadClick}
                    className="rounded-lg p-1 text-text-muted hover:bg-neural-500/10 hover:text-neural-400"
                  >
                    <Plus size={14} />
                  </motion.button>
                </div>

                {readyCount > 1 && (
                  <div className="mb-2 flex gap-2 px-2">
                    <button
                      onClick={onSelectAll}
                      className="text-[10px] text-neural-400 hover:text-neural-300"
                    >
                      Select all
                    </button>
                    <span className="text-[10px] text-text-muted">·</span>
                    <button
                      onClick={onDeselectAll}
                      className="text-[10px] text-text-muted hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {documents.length === 0 ? (
                  <button
                    onClick={onUploadClick}
                    className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 px-4 py-8 text-center transition-colors hover:border-neural-500/30 hover:bg-white/[0.02]"
                  >
                    <Upload className="h-6 w-6 text-text-muted" />
                    <span className="text-xs text-text-secondary">Upload your first PDF</span>
                  </button>
                ) : (
                  <div className="space-y-1">
                    {documents.map((doc) => {
                      const isInChat = selectedDocumentIds.includes(doc.id)
                      const canSelect = doc.status === 'ready'

                      return (
                        <motion.button
                          key={doc.id}
                          type="button"
                          disabled={!canSelect}
                          whileHover={canSelect ? { x: 4, scale: 1.01 } : undefined}
                          whileTap={canSelect ? { scale: 0.98 } : undefined}
                          onClick={() => canSelect && onToggleSelection(doc.id)}
                          className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                            isInChat
                              ? 'border border-neural-500/30 bg-neural-500/15 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                              : 'text-text-secondary hover:bg-white/5 hover:text-white'
                          } ${!canSelect ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                          {isInChat && (
                            <motion.div
                              layoutId={`glow-${doc.id}`}
                              className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-neural-500/5 to-cyan-glow/5"
                            />
                          )}
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                              isInChat
                                ? 'border-neural-500 bg-neural-500 text-white'
                                : 'border-white/20 bg-transparent'
                            }`}
                          >
                            {isInChat && <Check size={12} strokeWidth={3} />}
                          </span>
                          <FileText className={`h-4 w-4 shrink-0 ${isInChat ? 'text-neural-400' : ''}`} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm">{doc.name}</p>
                            <p className="text-[10px] text-text-muted">
                              {doc.status === 'processing'
                                ? `Processing ${doc.progress ?? 0}%`
                                : doc.status === 'error'
                                  ? 'Failed'
                                  : `${doc.pages} pages`}
                            </p>
                          </div>
                          {doc.status === 'processing' && (
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-glow" />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {documents.length > 0 && (
                  <p className="mt-3 px-2 text-[10px] leading-relaxed text-text-muted">
                    Click documents to include them in chat
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {collapsed && (
        <div className="flex flex-1 flex-col items-center gap-2 p-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onUploadClick}
            className="rounded-xl p-2.5 text-text-muted hover:bg-neural-500/10 hover:text-neural-400"
          >
            <Plus size={20} />
          </motion.button>
          {documents.map((doc) => (
            <motion.button
              key={doc.id}
              whileHover={{ scale: 1.1 }}
              onClick={() => doc.status === 'ready' && onToggleSelection(doc.id)}
              className={`relative rounded-xl p-2.5 ${
                selectedDocumentIds.includes(doc.id)
                  ? 'bg-neural-500/15 text-neural-400'
                  : 'text-text-muted hover:bg-white/5'
              }`}
            >
              <FileText size={18} />
            </motion.button>
          ))}
        </div>
      )}
    </motion.aside>
  )
}
