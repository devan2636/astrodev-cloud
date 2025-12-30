'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { FileText, Download, Eye, Loader2, File } from 'lucide-react'
import { Button } from './ui/button'
import { supabase } from '@/integrations/supabase/client'

interface Document {
  id: string
  title: string
  description: string | null
  file_path: string
  file_name: string
  file_size: number | null
  file_type: string | null
  download_count: number | null
  created_at: string
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return 'Unknown'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function getFileIcon(type: string | null) {
  return FileText
}

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('is_public', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setDocuments(data || [])
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleDownload = async (doc: Document) => {
    try {
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(doc.file_path)

      if (urlData?.publicUrl) {
        window.open(urlData.publicUrl, '_blank')
      }

      // Increment via RPC to avoid exposing broad UPDATE policy
      await supabase.rpc('increment_document_download', { doc_id: doc.id })
    } catch (error) {
      console.error('Error downloading document:', error)
    }
  }

  if (documents.length === 0 && !loading) {
    return null // Don't show section if no documents
  }

  return (
    <section id="documents" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

      <div ref={ref} className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-accent-purple" />
            <span className="text-sm font-medium text-accent-purple">Resources</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Shared Documents
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download resources, templates, and documentation that might be helpful for your projects
          </p>
        </motion.div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc, index) => {
              const FileIcon = getFileIcon(doc.file_type)
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card-strong rounded-2xl p-6 hover-lift"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-6 h-6 text-accent-purple" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 truncate">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{doc.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {doc.download_count || 0}
                        </span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}