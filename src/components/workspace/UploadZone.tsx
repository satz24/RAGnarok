import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, Sparkles } from 'lucide-react'
import { Particles } from '../effects/Particles'

interface UploadZoneProps {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => void
  onUploadMultiple?: (files: File[]) => void
}

export function UploadZone({ open, onClose, onUpload, onUploadMultiple }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const addFiles = (files: FileList | File[]) => {
    const pdfs = Array.from(files).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    )
    if (pdfs.length > 0) {
      setSelectedFiles((prev) => {
        const names = new Set(prev.map((f) => f.name + f.size))
        const unique = pdfs.filter((f) => !names.has(f.name + f.size))
        return [...prev, ...unique]
      })
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files)
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    if (onUploadMultiple && selectedFiles.length > 1) {
      onUploadMultiple(selectedFiles)
    } else {
      for (const file of selectedFiles) {
        onUpload(file)
      }
    }

    setSelectedFiles([])
    onClose()
  }

  const handleClose = () => {
    setSelectedFiles([])
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="gradient-border glass-strong glow-violet relative max-h-[90vh] w-full max-w-xl overflow-hidden rounded-3xl shadow-[0_0_80px_rgba(99,102,241,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Particles count={15} active={dragging} />

            <div className="relative overflow-y-auto p-8">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>

              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neural-500/20 to-cyan-glow/20">
                  <Sparkles className="h-7 w-7 text-neural-400" />
                </div>
                <h3 className="font-display mb-2 text-2xl font-bold">
                  <span className="gradient-text">Neural Ingestion Portal</span>
                </h3>
                <p className="text-sm text-text-secondary">
                  Drop PDFs for semantic indexing and neural processing
                </p>
              </div>

              <motion.div
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                animate={{
                  borderColor: dragging ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: dragging
                    ? '0 0 40px rgba(99, 102, 241, 0.2)'
                    : '0 0 0px rgba(99, 102, 241, 0)',
                }}
                className="relative rounded-2xl border-2 border-dashed p-8 text-center transition-all"
              >
                <Upload className={`mx-auto mb-4 h-10 w-10 ${dragging ? 'text-neural-400' : 'text-text-muted'}`} />
                <p className="mb-2 text-sm text-text-secondary">Drag & drop PDFs here</p>
                <p className="mb-4 text-xs text-text-muted">Multiple files supported</p>
                <label className="inline-block cursor-pointer rounded-xl bg-neural-500/10 px-6 py-2.5 text-sm font-medium text-neural-400 transition-colors hover:bg-neural-500/20">
                  Browse Files
                  <input type="file" accept=".pdf,application/pdf" multiple className="hidden" onChange={handleFileSelect} />
                </label>
              </motion.div>

              {selectedFiles.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 max-h-40 space-y-2 overflow-y-auto"
                >
                  {selectedFiles.map((file, i) => (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-3 py-2"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-neural-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-white">{file.name}</p>
                        <p className="text-[10px] text-text-muted">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(i)}
                        className="rounded p-1 text-text-muted hover:bg-white/5 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}

              {selectedFiles.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-neural-600 to-violet-glow py-3.5 text-sm font-medium text-white shadow-lg shadow-neural-500/25"
                >
                  Process {selectedFiles.length} Document{selectedFiles.length > 1 ? 's' : ''}
                </motion.button>
              )}

              <p className="mt-4 text-center text-[10px] text-text-muted">
                Supports PDF up to 50MB each · Select multiple docs for cross-document chat
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
