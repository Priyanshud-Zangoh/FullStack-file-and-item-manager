import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Download, File as FileIcon } from 'lucide-react'
import { getFiles, uploadFile, deleteFile } from '../../features/file/api'
import type { FileRecord } from '../../types'

export default function FileManager() {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      const data = await getFiles()
      setFiles(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setUploading(true)
    try {
      await uploadFile(selectedFile)
      fetchFiles()
    } catch (err) {
      console.error('Upload failed', err)
      alert('File upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this file permanently?')) return
    try {
      await deleteFile(id)
      fetchFiles()
    } catch (err) {
      console.error(err)
    }
  }

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Files</h1>
          <p className="page-subtitle">Upload and manage your documents securely via MinIO</p>
        </div>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            style={{ display: 'none' }} 
          />
          <button 
            className="btn btn-primary" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <span className="spinner" /> : <Upload size={16} />}
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center' }}><span className="spinner" /></div>
        ) : files.length === 0 ? (
          <div style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-dim)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={32} />
              </div>
            </div>
            <h3 style={{ marginBottom: '8px', color: 'var(--color-text)' }}>No files uploaded</h3>
            <p>Get started by uploading your first file.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', padding: '24px' }}>
            {files.map(file => (
              <div key={file.id} style={{ 
                border: '1px solid var(--color-border)', 
                borderRadius: 'var(--radius-md)', 
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: 'var(--color-bg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-primary)' }}>
                    <FileIcon size={24} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.filename}>
                      {file.filename}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-dim)' }}>
                      {formatSize(file.file_size)} • {file.content_type?.split('/')[1] || 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  {file.download_url && (
                    <a 
                      href={file.download_url} 
                      download={file.filename}
                      className="btn btn-secondary" 
                      style={{ flex: 1, padding: '6px 12px', justifyContent: 'center' }}
                    >
                      <Download size={14} /> Download
                    </a>
                  )}
                  <button 
                    className="btn btn-icon btn-secondary" 
                    onClick={() => handleDelete(file.id)}
                    style={{ color: 'var(--color-danger)' }}
                    title="Delete file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
