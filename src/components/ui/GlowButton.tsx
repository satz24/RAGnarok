import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlowButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  icon?: ReactNode
  magnetic?: boolean
}

export function GlowButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  icon,
  magnetic = true,
}: GlowButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  }

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-neural-600 to-violet-glow text-white shadow-lg shadow-neural-500/25 hover:shadow-neural-500/40',
    secondary:
      'glass text-white hover:bg-white/10 border border-white/10',
    ghost: 'text-text-secondary hover:text-white hover:bg-white/5',
  }

  return (
    <motion.button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      whileHover={magnetic ? { scale: 1.03, y: -1 } : undefined}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
    >
      {icon}
      {children}
    </motion.button>
  )
}
