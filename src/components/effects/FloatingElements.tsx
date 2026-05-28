import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FileText, MessageSquare, Highlighter, Search, Brain, Sparkles, BookOpen } from 'lucide-react'

interface FloatItem {
  id: string
  top: string
  left?: string
  right?: string
  delay: number
  duration: number
  hideMobile?: boolean
  content: ReactNode
}

function Chip({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`glass flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 shadow-lg shadow-neural-500/5 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  )
}

const items: FloatItem[] = [
  {
    id: 'pdf-1',
    top: '8%',
    left: '4%',
    delay: 0,
    duration: 7,
    hideMobile: true,
    content: (
      <Chip>
        <FileText className="h-3.5 w-3.5 text-neural-400" />
        <span className="font-mono text-[10px] text-text-secondary">research-paper.pdf</span>
      </Chip>
    ),
  },
  {
    id: 'cite-1',
    top: '14%',
    right: '6%',
    delay: 0.4,
    duration: 6,
    content: (
      <Chip className="border-cyan-glow/20">
        <Highlighter className="h-3 w-3 text-cyan-glow" />
        <span className="font-mono text-[10px] text-cyan-glow">p.12 · cited</span>
      </Chip>
    ),
  },
  {
    id: 'query-1',
    top: '28%',
    left: '2%',
    delay: 0.8,
    duration: 8,
    hideMobile: true,
    content: (
      <Chip>
        <MessageSquare className="h-3 w-3 text-violet-glow" />
        <span className="max-w-[120px] truncate text-[10px] text-text-secondary">
          Summarize key findings
        </span>
      </Chip>
    ),
  },
  {
    id: 'confidence',
    top: '38%',
    right: '3%',
    delay: 1.2,
    duration: 7.5,
    hideMobile: true,
    content: (
      <Chip className="border-green-500/20">
        <Sparkles className="h-3 w-3 text-green-400" />
        <span className="text-[10px] text-green-400">94% confidence</span>
      </Chip>
    ),
  },
  {
    id: 'search',
    top: '52%',
    left: '5%',
    delay: 0.2,
    duration: 9,
    content: (
      <Chip>
        <Search className="h-3 w-3 text-neural-400" />
        <span className="text-[10px] text-text-muted">semantic index</span>
      </Chip>
    ),
  },
  {
    id: 'pdf-2',
    top: '58%',
    right: '4%',
    delay: 0.6,
    duration: 8,
    hideMobile: true,
    content: (
      <Chip>
        <FileText className="h-3.5 w-3.5 text-cyan-glow/80" />
        <span className="font-mono text-[10px] text-text-secondary">annual-report.pdf</span>
      </Chip>
    ),
  },
  {
    id: 'brain',
    top: '68%',
    left: '3%',
    delay: 1,
    duration: 7,
    hideMobile: true,
    content: (
      <Chip className="border-neural-500/30">
        <Brain className="h-3.5 w-3.5 text-neural-400" />
        <span className="text-[10px] text-neural-300">neural parse</span>
      </Chip>
    ),
  },
  {
    id: 'cite-2',
    top: '72%',
    right: '7%',
    delay: 0.3,
    duration: 6.5,
    content: (
      <div className="flex gap-1.5">
        {['p.3', 'p.7', 'p.14'].map((p) => (
          <span
            key={p}
            className="glass rounded-md border border-cyan-glow/20 px-2 py-1 font-mono text-[10px] text-cyan-glow"
          >
            {p}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'query-2',
    top: '82%',
    left: '6%',
    delay: 0.5,
    duration: 8.5,
    hideMobile: true,
    content: (
      <Chip>
        <BookOpen className="h-3 w-3 text-violet-glow" />
        <span className="max-w-[130px] truncate text-[10px] text-text-secondary">
          Compare across documents
        </span>
      </Chip>
    ),
  },
  {
    id: 'stream',
    top: '88%',
    right: '5%',
    delay: 0.9,
    duration: 7,
    content: (
      <Chip className="border-neural-500/20">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-neural-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="text-[10px] text-neural-300">streaming response</span>
      </Chip>
    ),
  },
]

export function FloatingElements() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={`absolute opacity-40 md:opacity-50 ${item.hideMobile ? 'hidden md:block' : ''}`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 0.45,
            scale: 1,
            y: [0, -14, 0],
            x: [0, 6, 0],
          }}
          transition={{
            opacity: { duration: 1, delay: item.delay },
            scale: { duration: 0.8, delay: item.delay },
            y: { duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'easeInOut' },
            x: { duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {item.content}
        </motion.div>
      ))}

      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
        <motion.line
          x1="8%"
          y1="12%"
          x2="92%"
          y2="18%"
          stroke="url(#lineGrad)"
          strokeWidth="1"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.line
          x1="6%"
          y1="55%"
          x2="94%"
          y2="60%"
          stroke="url(#lineGrad)"
          strokeWidth="1"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        />
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
