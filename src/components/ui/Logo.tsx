import { motion } from 'framer-motion'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  animated?: boolean
}

export function Logo({ size = 'md', showText = true, animated = true }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
  }

  const s = sizes[size]

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative"
        animate={animated ? { rotate: [0, 360] } : undefined}
        transition={animated ? { duration: 20, repeat: Infinity, ease: 'linear' } : undefined}
        style={{ width: s.icon, height: s.icon }}
      >
        <svg viewBox="0 0 32 32" fill="none" className="h-full w-full">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path
            d="M16 4 L26 10 L26 22 L16 28 L6 22 L6 10 Z"
            stroke="url(#logoGrad)"
            strokeWidth="1.5"
            fill="none"
          />
          <circle cx="16" cy="16" r="3" fill="url(#logoGrad)" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180
            const x = 16 + 8 * Math.sin(rad)
            const y = 16 - 8 * Math.cos(rad)
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill={i % 2 === 0 ? '#06b6d4' : '#8b5cf6'}
                opacity="0.8"
              />
            )
          })}
        </svg>
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full bg-neural-500/20 blur-md"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
      {showText && (
        <span className={`font-display font-bold tracking-tight ${s.text}`}>
          <span className="gradient-text">RAGnarok</span>
        </span>
      )}
    </div>
  )
}
