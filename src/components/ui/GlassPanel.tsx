import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  strong?: boolean
  glow?: 'neural' | 'cyan' | 'violet' | 'none'
  hover?: boolean
  onClick?: () => void
}

export function GlassPanel({
  children,
  className = '',
  strong = false,
  glow = 'none',
  hover = false,
  onClick,
}: GlassPanelProps) {
  const glowClass = glow === 'neural' ? 'glow-neural' : glow === 'cyan' ? 'glow-cyan' : glow === 'violet' ? 'glow-violet' : ''

  return (
    <motion.div
      className={`rounded-2xl ${strong ? 'glass-strong' : 'glass'} ${glowClass} ${className}`}
      whileHover={hover ? { scale: 1.01, borderColor: 'rgba(255,255,255,0.15)' } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
