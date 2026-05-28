import { motion } from 'framer-motion'
import { Upload, Cpu, MessageCircle, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Documents',
    description: 'Drag and drop PDFs into the neural ingestion pipeline. Multi-file batch processing supported.',
    color: 'text-neural-400',
    bg: 'bg-neural-500/10',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'Neural Processing',
    description: 'AI extracts structure, embeddings, and semantic maps. Tables, charts, and references indexed.',
    color: 'text-violet-glow',
    bg: 'bg-violet-glow/10',
  },
  {
    icon: MessageCircle,
    step: '03',
    title: 'Intelligent Chat',
    description: 'Ask natural language questions. Receive streaming answers with inline source citations.',
    color: 'text-cyan-glow',
    bg: 'bg-cyan-glow/10',
  },
  {
    icon: CheckCircle2,
    step: '04',
    title: 'Verify & Export',
    description: 'Jump to referenced pages, highlight source text, and export findings to your workflow.',
    color: 'text-neural-400',
    bg: 'bg-neural-500/10',
  },
]

export function Workflow() {
  return (
    <section id="workflow" className="relative px-4 py-32 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <span className="mb-4 inline-block text-sm font-medium tracking-widest text-cyan-glow uppercase">
            Workflow
          </span>
          <h2 className="font-display mb-4 text-4xl font-bold md:text-5xl">
            From PDF to <span className="gradient-text-accent">Insight</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute top-1/2 right-0 left-0 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-neural-500/30 to-transparent md:block" />

          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <motion.div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.bg} glass`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <step.icon className={`h-7 w-7 ${step.color}`} />
                </motion.div>

                <span className="font-mono mb-2 block text-xs text-text-muted">{step.step}</span>
                <h3 className="font-display mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>

                {i < steps.length - 1 && (
                  <div className="mt-6 flex justify-center md:hidden">
                    <div className="h-8 w-px bg-gradient-to-b from-neural-500/50 to-transparent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
