import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Brain } from 'lucide-react'
import { GlowButton } from '../ui/GlowButton'
import { GlassPanel } from '../ui/GlassPanel'

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 pt-24 pb-16 md:px-8">
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary backdrop-blur-sm"
        >
          <Sparkles className="h-4 w-4 text-cyan-glow" />
          <span>Next-generation AI document intelligence</span>
          <span className="rounded-full bg-neural-500/20 px-2 py-0.5 text-xs text-neural-400">v2.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display mb-6 text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="gradient-text">Research PDFs</span>
          <br />
          <span className="text-white/90">Like an AI Lab</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-text-secondary md:text-xl"
        >
          Upload documents. Ask questions. Get cited answers with page-level precision.
          A cinematic workspace built for researchers, analysts, and knowledge workers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16 flex justify-center"
        >
          <Link to="/workspace">
            <GlowButton size="lg" icon={<ArrowRight className="h-5 w-5" />}>
              Enter Workspace
            </GlowButton>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-neural-500/20 via-violet-glow/20 to-cyan-glow/20 blur-2xl" />
          <GlassPanel strong glow="neural" className="gradient-border relative overflow-hidden p-1">
            <div className="rounded-[14px] bg-void-elevated/80 p-4 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-4 font-mono text-xs text-text-muted">ragnarok.workspace</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 md:block">
                  <div className="mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-neural-400" />
                    <span className="text-xs font-medium text-text-secondary">Documents</span>
                  </div>
                  <div className="mb-2 rounded-lg border border-neural-500/20 bg-neural-500/10 px-3 py-2 text-xs text-neural-100">
                    your-document.pdf
                  </div>
                  <div className="rounded-lg px-3 py-2 text-xs text-text-muted opacity-50">
                    Drop PDFs here...
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 md:col-span-1">
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-glow" />
                    <span className="text-xs font-medium text-text-secondary">Neural Chat</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mb-3 rounded-lg bg-neural-500/10 p-3 text-left text-xs text-text-secondary"
                  >
                    Summarize the key findings
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="rounded-lg border border-white/5 bg-white/[0.03] p-3 text-left text-xs leading-relaxed text-text-primary"
                  >
                    <span className="text-neural-400">RAGnarok</span>
                    <p className="mt-1">
                      Based on your document, here are the main findings with source citations...
                    </p>
                    <div className="mt-2 flex gap-1">
                      <span className="rounded bg-cyan-glow/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan-glow">p.3</span>
                      <span className="rounded bg-cyan-glow/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan-glow">p.7</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 text-text-muted"
        >
          {['Trusted by 2,000+ researchers', 'SOC 2 Compliant', 'Enterprise Ready'].map((stat) => (
            <span key={stat} className="text-sm">{stat}</span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
