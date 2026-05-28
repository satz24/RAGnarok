import { NeuralBackground } from './NeuralBackground'
import { motion } from 'framer-motion'

export function AmbientBackground({ intensity = 'medium' as 'low' | 'medium' | 'high' }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <NeuralBackground intensity={intensity} />

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 70%)',
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-neural-600/20 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-glow/15 blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-glow/10 blur-[80px]"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/30 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/80" />
    </div>
  )
}
