import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Upload, Command } from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  onAction: (action: string) => void
}

const COMMANDS = [
  { id: 'upload', label: 'Upload Document', icon: Upload, shortcut: '⌘U' },
  { id: 'new-chat', label: 'New Chat Session', icon: MessageSquare, shortcut: '⌘N' },
]

export function CommandPalette({ open, onClose, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)

  const filtered = COMMANDS.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    if (!open) {
      setQuery('')
      setSelected(0)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected((s) => Math.min(s + 1, filtered.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected((s) => Math.max(s - 1, 0))
      }
      if (e.key === 'Enter' && filtered[selected]) {
        onAction(filtered[selected].id)
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, filtered, selected, onAction, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-void/60 pt-[20vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            className="glass-strong w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              <Command className="h-5 w-5 text-text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
                placeholder="Type a command..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-text-muted focus:outline-none"
              />
              <kbd className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-text-muted">ESC</kbd>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.map((cmd, i) => (
                <motion.button
                  key={cmd.id}
                  whileHover={{ x: 2 }}
                  onClick={() => { onAction(cmd.id); onClose() }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                    i === selected ? 'bg-neural-500/15 text-white' : 'text-text-secondary hover:bg-white/5'
                  }`}
                >
                  <cmd.icon size={16} className={i === selected ? 'text-neural-400' : ''} />
                  <span className="flex-1">{cmd.label}</span>
                  <kbd className="font-mono text-[10px] text-text-muted">{cmd.shortcut}</kbd>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-text-muted">No commands found</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
