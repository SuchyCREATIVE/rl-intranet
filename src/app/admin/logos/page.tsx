'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, Trash2, Check, Star, Plus, X } from 'lucide-react'

interface Logo {
  id: string
  company: string
  label: string
  filePath: string
  isActive: boolean
  builtin?: boolean
}

const COMPANIES = [
  { key: 'raederlogistik', label: 'Räderlogistik Franchise GmbH' },
  { key: 'reifen-gerlach', label: 'Reifen Gerlach GmbH' },
  { key: 'rtg', label: 'RTG GmbH' },
]

const LABEL_SUGGESTIONS = ['Standard', 'Weihnachten', 'Karneval', 'Ostern']

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<Logo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadCompany, setUploadCompany] = useState('raederlogistik')
  const [uploadLabel, setUploadLabel] = useState('')
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadLogos = useCallback(async () => {
    const res = await fetch('/api/logos')
    if (res.ok) setLogos(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { loadLogos() }, [loadLogos])

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = e => setPreviewFile(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleUpload() {
    if (!selectedFile || !uploadLabel.trim()) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('company', uploadCompany)
    formData.append('label', uploadLabel.trim())
    const res = await fetch('/api/admin/logos', { method: 'POST', body: formData })
    if (res.ok) {
      setSelectedFile(null)
      setPreviewFile(null)
      setUploadLabel('')
      await loadLogos()
    }
    setUploading(false)
  }

  async function handleToggleActive(logo: Logo) {
    if (logo.builtin) return
    setTogglingId(logo.id)
    await fetch('/api/admin/logos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: logo.id, isActive: !logo.isActive }),
    })
    await loadLogos()
    setTogglingId(null)
  }

  async function handleDelete(logo: Logo) {
    if (logo.builtin) return
    setDeletingId(logo.id)
    await fetch(`/api/admin/logos?id=${logo.id}`, { method: 'DELETE' })
    await loadLogos()
    setDeletingId(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logo-Verwaltung</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Standard- und Saisonale Logos (Weihnachten, Karneval, Ostern) für alle drei Firmen verwalten.
          Das aktive Logo wird im Signatur-Generator als Vorauswahl angezeigt.
        </p>
      </div>

      {/* Upload-Bereich */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <Plus size={16} className="text-gray-400" />
          Neues Logo hochladen
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Firma</label>
            <select
              value={uploadCompany}
              onChange={e => setUploadCompany(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50"
            >
              {COMPANIES.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bezeichnung</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={uploadLabel}
                onChange={e => setUploadLabel(e.target.value)}
                placeholder="z. B. Weihnachten"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50"
              />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {LABEL_SUGGESTIONS.map(s => (
                <button key={s} type="button" onClick={() => setUploadLabel(s)}
                  className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:border-[#DCFF0C] hover:text-gray-800 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Datei-Upload */}
        <input
          ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]) }}
        />
        {previewFile ? (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewFile} alt="Vorschau" className="h-16 w-auto object-contain border border-gray-100 rounded bg-white p-1" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{selectedFile?.name}</p>
              <p className="text-xs text-gray-400">{selectedFile ? Math.round(selectedFile.size / 1024) : 0} KB</p>
            </div>
            <button type="button" onClick={() => { setPreviewFile(null); setSelectedFile(null) }}
              className="text-gray-400 hover:text-red-500 transition-colors">
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]) }}
            className={`w-full h-28 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg text-sm transition-all ${
              isDragging ? 'border-[#DCFF0C] bg-[#DCFF0C]/5 text-gray-800' : 'border-gray-200 text-gray-500 hover:border-[#DCFF0C]/50'
            }`}
          >
            <Upload size={20} className={isDragging ? 'text-[#DCFF0C]' : 'text-gray-400'} />
            <span>{isDragging ? 'Datei loslassen' : 'Logo hochladen'}</span>
            <span className="text-xs text-gray-400">JPG, PNG, SVG · Drag & Drop oder Klick</span>
          </button>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || !uploadLabel.trim() || uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1c1c1c] text-[#DCFF0C] font-semibold text-sm rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Upload size={15} />
          {uploading ? 'Wird hochgeladen…' : 'Logo speichern'}
        </button>
      </div>

      {/* Logo-Übersicht nach Firma */}
      {loading ? (
        <div className="text-sm text-gray-400 py-8 text-center">Logos werden geladen…</div>
      ) : (
        COMPANIES.map(company => {
          const companyLogos = logos.filter(l => l.company === company.key)
          return (
            <div key={company.key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
                <h2 className="font-semibold text-gray-800">{company.label}</h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {companyLogos.length} Logo{companyLogos.length !== 1 ? 's' : ''}
                </span>
              </div>

              {companyLogos.length === 0 ? (
                <div className="px-6 py-8 text-sm text-gray-400 text-center">
                  Keine Logos vorhanden
                </div>
              ) : (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {companyLogos.map(logo => (
                    <div
                      key={logo.id}
                      className={`relative rounded-lg border-2 p-3 flex flex-col items-center gap-2 transition-all ${
                        logo.isActive ? 'border-[#DCFF0C] bg-[#DCFF0C]/5' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      {/* Aktiv-Badge */}
                      {logo.isActive && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#DCFF0C] flex items-center justify-center">
                          <Check size={11} className="text-[#1c1c1c]" />
                        </div>
                      )}

                      {/* Logo-Vorschau */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logo.filePath}
                        alt={logo.label}
                        className="h-14 w-auto object-contain"
                      />

                      {/* Label */}
                      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                        {logo.label}
                        {logo.builtin && <span className="text-gray-400 font-normal"> (Standard)</span>}
                      </span>

                      {/* Aktionen */}
                      {!logo.builtin && (
                        <div className="flex gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(logo)}
                            disabled={togglingId === logo.id}
                            title={logo.isActive ? 'Deaktivieren' : 'Als aktiv setzen'}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-all ${
                              logo.isActive
                                ? 'border-[#DCFF0C] text-[#1c1c1c] bg-[#DCFF0C]'
                                : 'border-gray-200 text-gray-500 hover:border-[#DCFF0C]'
                            } disabled:opacity-50`}
                          >
                            <Star size={11} />
                            {logo.isActive ? 'Aktiv' : 'Aktivieren'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(logo)}
                            disabled={deletingId === logo.id}
                            title="Löschen"
                            className="flex items-center text-xs px-2 py-1 rounded border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition-all disabled:opacity-50"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
