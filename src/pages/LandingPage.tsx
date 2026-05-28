import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AmbientBackground } from '../components/effects/AmbientBackground'
import { CursorGlow } from '../components/effects/CursorGlow'
import { FloatingElements } from '../components/effects/FloatingElements'
import { Hero } from '../components/landing/Hero'
import { Features } from '../components/landing/Features'
import { Workflow } from '../components/landing/Workflow'
import { CTA } from '../components/landing/CTA'
import { Logo } from '../components/ui/Logo'
import { GlowButton } from '../components/ui/GlowButton'

export function LandingPage() {
  return (
    <div className="relative min-h-screen bg-void">
      <AmbientBackground intensity="medium" />
      <CursorGlow />
      <FloatingElements />

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 left-0 z-50 px-4 py-4 md:px-8"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            to="/"
            className="glass-strong gradient-border group rounded-2xl px-4 py-2.5 transition-shadow hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
          >
            <Logo size="sm" />
          </Link>
          <Link to="/workspace">
            <GlowButton size="sm">Launch Workspace</GlowButton>
          </Link>
        </div>
      </motion.header>

      <Hero />
      <div className="relative z-10">
        <Features />
        <Workflow />
        <CTA />
      </div>

      <footer className="relative z-10 border-t border-white/5 px-4 py-12 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <Logo size="sm" />
          <p className="text-sm text-text-muted">
            © 2026 RAGnarok. Built for the future of document intelligence.
          </p>
          <div className="flex gap-6 text-sm text-text-muted">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
