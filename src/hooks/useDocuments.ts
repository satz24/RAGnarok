import { useState, useCallback, useMemo } from 'react'
import type { Document } from '../types'
import { getPdfPageCount, extractPdfText } from '../services/pdf'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([])
  const [previewDocumentId, setPreviewDocumentId] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const previewDocument = documents.find((d) => d.id === previewDocumentId) ?? documents.find((d) => selectedDocumentIds.includes(d.id))

  const allSelectedDocuments = useMemo(
    () => documents.filter((d) => selectedDocumentIds.includes(d.id)),
    [documents, selectedDocumentIds]
  )

  const selectedDocuments = useMemo(
    () =>
      allSelectedDocuments.filter(
        (d) => d.status === 'ready' && d.extractedText?.trim()
      ),
    [allSelectedDocuments]
  )

  const processFile = useCallback(async (file: File) => {
    const docId = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    const newDoc: Document = {
      id: docId,
      name: file.name,
      pages: 0,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date(),
      status: 'processing',
      progress: 0,
      file,
    }

    setDocuments((prev) => [newDoc, ...prev])
    setSelectedDocumentIds((prev) => [...prev, docId])
    setPreviewDocumentId(docId)

    try {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, progress: 20 } : d))
      )

      const [pages, extractedText] = await Promise.all([
        getPdfPageCount(file),
        extractPdfText(file),
      ])

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? { ...d, status: 'ready' as const, pages, extractedText, progress: 100, file }
            : d
        )
      )
    } catch {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === docId
            ? { ...d, status: 'error' as const, errorMessage: 'Failed to process PDF', progress: 0 }
            : d
        )
      )
      setSelectedDocumentIds((prev) => prev.filter((id) => id !== docId))
    }
  }, [])

  const uploadDocument = useCallback(
    async (file: File) => {
      setIsUploading(true)
      try {
        await processFile(file)
      } finally {
        setIsUploading(false)
      }
    },
    [processFile]
  )

  const uploadDocuments = useCallback(
    async (files: File[]) => {
      setIsUploading(true)
      try {
        for (const file of files) {
          await processFile(file)
        }
      } finally {
        setIsUploading(false)
      }
    },
    [processFile]
  )

  const toggleDocumentSelection = useCallback((id: string) => {
    setSelectedDocumentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    setPreviewDocumentId(id)
  }, [])

  const selectAllReady = useCallback(() => {
    setSelectedDocumentIds(
      documents.filter((d) => d.status === 'ready' && d.extractedText?.trim()).map((d) => d.id)
    )
  }, [documents])

  const deselectAll = useCallback(() => {
    setSelectedDocumentIds([])
  }, [])

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    setSelectedDocumentIds((prev) => prev.filter((x) => x !== id))
  }, [])

  return {
    documents,
    selectedDocumentIds,
    selectedDocuments,
    allSelectedDocuments,
    previewDocument,
    previewDocumentId,
    setPreviewDocumentId,
    toggleDocumentSelection,
    selectAllReady,
    deselectAll,
    uploadDocument,
    uploadDocuments,
    removeDocument,
    isUploading,
  }
}
