export interface Document {
  id: string
  name: string
  pages: number
  size: string
  uploadedAt: Date
  status: 'processing' | 'ready' | 'error'
  progress?: number
  file?: File
  extractedText?: string
  errorMessage?: string
}

export interface SourceCitation {
  id: string
  page: number
  excerpt: string
  confidence: number
  documentId?: string
  documentName?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: SourceCitation[]
  confidence?: number
  isStreaming?: boolean
  error?: boolean
}

export interface DocumentContext {
  id: string
  name: string
  text: string
}
