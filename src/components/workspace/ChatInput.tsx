import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Command } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = 'Ask about your document...' }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-white/5 p-4 md:p-6">
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 30px rgba(99, 102, 241, 0.15), 0 0 60px rgba(99, 102, 241, 0.05)'
            : '0 0 0px rgba(99, 102, 241, 0)',
        }}
        className={`glass-strong gradient-border mx-auto w-full max-w-5xl rounded-2xl transition-all ${focused ? 'border-neural-500/30' : ''}`}
      >
        <div className="flex items-end gap-2 p-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent py-2 text-sm text-white placeholder:text-text-muted focus:outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className={`rounded-xl p-2.5 transition-all ${
              value.trim() && !disabled
                ? 'bg-gradient-to-r from-neural-600 to-violet-glow text-white shadow-lg shadow-neural-500/25'
                : 'bg-white/5 text-text-muted'
            }`}
          >
            <Send size={18} />
          </motion.button>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 px-4 py-2">
          <div className="flex items-center gap-3 text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <Command size={10} />
              Enter to send
            </span>
            <span>Shift + Enter for new line</span>
          </div>
          <span className="text-[10px] text-text-muted">{value.length}/4000</span>
        </div>
      </motion.div>
    </div>
  )
}
