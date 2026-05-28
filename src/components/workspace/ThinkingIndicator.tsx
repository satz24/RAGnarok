import { motion } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import { NeuralWaveform } from '../effects/NeuralWaveform'

export function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex w-full gap-3"
    >
      <motion.div
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neural-500/25 to-violet-glow/25 ring-1 ring-neural-500/20"
        animate={{ boxShadow: ['0 0 0px rgba(99,102,241,0)', '0 0 24px rgba(99,102,241,0.4)', '0 0 0px rgba(99,102,241,0)'] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Bot className="h-5 w-5 text-neural-400" />
      </motion.div>

      <div className="glass-ai min-w-0 flex-1 rounded-2xl rounded-tl-md px-6 py-5 md:px-8">
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-glow" />
            <span className="text-[11px] font-medium tracking-wide text-neural-300 uppercase">
              Neural processing
            </span>
          </div>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[10px] text-cyan-glow"
          >
            streaming...
          </motion.span>
        </div>

        <NeuralWaveform />

        <div className="mt-5 space-y-2.5">
          <div className="skeleton h-2.5 w-full max-w-lg rounded" />
          <div className="skeleton h-2.5 w-full max-w-md rounded" />
          <div className="skeleton h-2.5 w-full max-w-sm rounded" />
        </div>
      </div>
    </motion.div>
  )
}
