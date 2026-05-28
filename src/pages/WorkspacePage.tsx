import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PanelLeft, MessageSquare, Upload, Home, BookOpen } from 'lucide-react'
import { AmbientBackground } from '../components/effects/AmbientBackground'
import { CursorGlow } from '../components/effects/CursorGlow'
import { Sidebar } from '../components/workspace/Sidebar'
import { ChatArea } from '../components/workspace/ChatArea'
import { ContextPanel } from '../components/workspace/ContextPanel'
import { UploadZone } from '../components/workspace/UploadZone'
import { CommandPalette } from '../components/workspace/CommandPalette'
import { Logo } from '../components/ui/Logo'
import { useChat } from '../hooks/useChat'
import { useDocuments } from '../hooks/useDocuments'
import type { SourceCitation } from '../types'

type MobilePanel = 'sidebar' | 'chat' | 'context'

export function WorkspacePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('chat')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeCitation, setActiveCitation] = useState<SourceCitation | undefined>()

  const {
    documents,
    selectedDocumentIds,
    selectedDocuments,
    allSelectedDocuments,
    previewDocument,
    setPreviewDocumentId,
    toggleDocumentSelection,
    selectAllReady,
    deselectAll,
    uploadDocument,
    uploadDocuments,
  } = useDocuments()

  const { messages, isThinking, sendMessage, clearChat } = useChat(allSelectedDocuments, selectedDocuments)

  useEffect(() => {
    setCurrentPage(1)
    setActiveCitation(undefined)
  }, [previewDocument?.id])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
      if (e.key === 'Escape') {
        setCommandOpen(false)
        setUploadOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSourceClick = useCallback((citation: SourceCitation) => {
    if (citation.documentId) setPreviewDocumentId(citation.documentId)
    setCurrentPage(citation.page)
    setActiveCitation(citation)
    setContextOpen(true)
    setMobilePanel('context')
  }, [setPreviewDocumentId])

  const handleCommand = (action: string) => {
    if (action === 'upload') setUploadOpen(true)
    if (action === 'new-chat') clearChat()
  }

  const sidebarProps = {
    documents,
    selectedDocumentIds,
    onToggleSelection: toggleDocumentSelection,
    onSelectAll: selectAllReady,
    onDeselectAll: deselectAll,
    onUploadClick: () => setUploadOpen(true),
  }

  return (
    <div className="relative h-screen overflow-hidden bg-void">
      <AmbientBackground intensity="low" />
      <CursorGlow />

      <div className="relative z-10 flex h-full flex-col p-2 md:p-4">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-strong mb-2 flex items-center justify-between rounded-xl px-4 py-3 lg:hidden"
        >
          <Link to="/"><Logo size="sm" /></Link>
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-1.5 text-[10px] text-neural-400">
            <span className="h-1.5 w-1.5 rounded-full bg-neural-400" />
            RAGnarok
          </motion.div>
        </motion.div>

        <div className="flex min-h-0 flex-1 gap-3 md:gap-4">
          <motion.div
            layout
            className="hidden shrink-0 lg:block"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              {...sidebarProps}
            />
          </motion.div>

          <AnimatePresence>
            {mobilePanel === 'sidebar' && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-y-0 left-0 z-30 w-[280px] p-2 lg:hidden"
              >
                <Sidebar collapsed={false} onToggle={() => setMobilePanel('chat')} {...sidebarProps} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.main
            layout
            className={`glass-strong glow-neural min-w-0 flex-1 overflow-hidden rounded-2xl ${
              mobilePanel !== 'chat' ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'
            }`}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ChatArea
              messages={messages}
              isThinking={isThinking}
              selectedDocuments={selectedDocuments}
              onSend={sendMessage}
              onSourceClick={handleSourceClick}
            />
          </motion.main>

          <ContextPanel
            open={contextOpen}
            onClose={() => setContextOpen(false)}
            document={previewDocument}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            activeCitation={activeCitation}
          />

          <AnimatePresence>
            {mobilePanel === 'context' && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute inset-y-0 right-0 z-30 w-full max-w-[380px] p-2 xl:hidden"
              >
                <ContextPanel
                  open
                  embedded
                  onClose={() => setMobilePanel('chat')}
                  document={previewDocument}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  activeCitation={activeCitation}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.nav
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-strong mx-auto mt-2 flex items-center gap-1 rounded-2xl p-1.5 lg:hidden"
        >
          {[
            { id: 'sidebar' as const, icon: PanelLeft, label: 'Docs' },
            { id: 'chat' as const, icon: MessageSquare, label: 'Chat' },
            { id: 'context' as const, icon: BookOpen, label: 'Context' },
          ].map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobilePanel(item.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-2 ${
                mobilePanel === item.id ? 'bg-neural-500/15 text-neural-400' : 'text-text-muted'
              }`}
            >
              <item.icon size={18} />
              <span className="text-[10px]">{item.label}</span>
            </motion.button>
          ))}
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setUploadOpen(true)} className="rounded-xl px-3 py-2 text-text-muted">
            <Upload size={18} />
          </motion.button>
          <Link to="/" className="rounded-xl px-3 py-2 text-text-muted"><Home size={18} /></Link>
        </motion.nav>
      </div>

      <UploadZone open={uploadOpen} onClose={() => setUploadOpen(false)} onUpload={uploadDocument} onUploadMultiple={uploadDocuments} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onAction={handleCommand} />
    </div>
  )
}
