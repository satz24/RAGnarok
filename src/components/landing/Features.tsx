import { motion } from 'framer-motion'
import { Brain, FileSearch, MessageSquare, Shield, Sparkles, Zap } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'

const features = [
  {
    icon: Brain,
    title: 'Neural Understanding',
    description: 'Deep semantic analysis that comprehends context, tables, charts, and complex document structures.',
    gradient: 'from-neural-500 to-violet-glow',
    glow: 'neural' as const,
  },
  {
    icon: FileSearch,
    title: 'Precision Citations',
    description: 'Every answer links to exact page references with highlighted source text for instant verification.',
    gradient: 'from-cyan-glow to-neural-500',
    glow: 'cyan' as const,
  },
  {
    icon: MessageSquare,
    title: 'Conversational Research',
    description: 'Multi-turn dialogue that builds on previous questions, maintaining full document context.',
    gradient: 'from-violet-glow to-cyan-glow',
    glow: 'violet' as const,
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Upload and analyze documents in seconds with our optimized neural pipeline architecture.',
    gradient: 'from-neural-500 to-cyan-glow',
    glow: 'neural' as const,
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption, zero data retention, and SOC 2 compliant infrastructure.',
    gradient: 'from-violet-glow to-neural-500',
    glow: 'violet' as const,
  },
  {
    icon: Sparkles,
    title: 'Smart Summaries',
    description: 'Auto-generate executive summaries, key findings, and actionable insights from any PDF.',
    gradient: 'from-cyan-glow to-violet-glow',
    glow: 'cyan' as const,
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Features() {
  return (
    <section id="features" className="relative px-4 py-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-widest text-neural-400 uppercase">
            Capabilities
          </span>
          <h2 className="font-display mb-4 text-4xl font-bold md:text-5xl">
            <span className="gradient-text-accent">Intelligence</span> Built In
          </h2>
          <p className="mx-auto max-w-2xl text-text-secondary">
            Every feature designed for researchers who demand accuracy, speed, and a workspace that feels like the future.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <GlassPanel glow={feature.glow} hover className="group h-full p-6 transition-all duration-300">
                <div
                  className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-display mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
                <div className="mt-4 h-px w-0 bg-gradient-to-r from-neural-500 to-transparent transition-all duration-500 group-hover:w-full" />
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
