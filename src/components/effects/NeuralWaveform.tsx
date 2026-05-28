import { motion } from 'framer-motion'

export function NeuralWaveform() {
  const bars = 24
  return (
    <div className="flex h-8 items-end justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-neural-600 to-cyan-glow"
          animate={{
            height: [4, 8 + Math.sin(i * 0.5) * 16, 4],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8 + (i % 5) * 0.1,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
