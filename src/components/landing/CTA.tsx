import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { GlowButton } from '../ui/GlowButton'

export function CTA() {
  return (
    <section className="relative px-4 py-32 md:px-8">
      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="gradient-border relative overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neural-600/20 via-violet-glow/10 to-cyan-glow/20" />
          <div className="glass-strong relative px-8 py-16 text-center md:px-16 md:py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 h-40 w-40 rounded-full border border-neural-500/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full border border-cyan-glow/10"
            />

            <h2 className="font-display mb-4 text-4xl font-bold md:text-5xl">
              Ready to <span className="gradient-text">Transform</span> Your Research?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-text-secondary">
              Join thousands of researchers using RAGnarok to unlock insights from their documents.
              Start free — no credit card required.
            </p>
            <Link to="/workspace">
              <GlowButton size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                Launch Your Workspace
              </GlowButton>
            </Link>
            <p className="mt-4 text-xs text-text-muted">
              Free tier includes 5 documents · Unlimited chat · Source citations
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
