import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const handleLeave = () => setVisible(false)

    window.addEventListener('mousemove', handleMove)
    document.body.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      document.body.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  if (!visible) return null

  return (
    <motion.div
      className="pointer-events-none fixed z-[9999] mix-blend-screen"
      animate={{ x: position.x - 200, y: position.y - 200 }}
      transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
    >
      <div className="h-[400px] w-[400px] rounded-full bg-neural-500/5 blur-[80px]" />
    </motion.div>
  )
}
