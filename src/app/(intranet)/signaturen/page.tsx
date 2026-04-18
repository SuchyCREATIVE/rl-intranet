'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy, Check, Upload, X, Save, BookOpen, Pen,
  Trash2, FolderOpen, ChevronDown, ChevronUp, MapPin,
  Image, Plus, ArrowUp, ArrowDown,
} from 'lucide-react'
import Link from 'next/link'
import SignaturePreview from '@/components/SignaturePreview'
import { SignatureData, CompanyKey, COMPANY_CONFIG, generateSignatureHTMLSync } from '@/lib/signature-export'

interface CompanyLogo {
  id: string
  company: string
  label: string
  filePath: string
  isActive: boolean
  builtin?: boolean
}

const ALL_COMPANIES: { key: CompanyKey; label: string }[] = [
  { key: 'raederlogistik', label: 'Räderlogistik Franchise GmbH' },
  { key: 'reifen-gerlach', label: 'Reifen Gerlach GmbH' },
  { key: 'rtg', label: 'RTG GmbH' },
]

const schema = z.object({
  name: z.string().optional(),
  company: z.enum(['raederlogistik', 'reifen-gerlach', 'rtg']),
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  position: z.string().min(1, 'Position ist erforderlich'),
  phone: z.string().optional(),
  fax: z.string().optional(),
  mobile: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  website: z.string().url('Gültige URL erforderlich').optional().or(z.literal('')),
  photoUrl: z.string().optional(),
  showStandorte: z.boolean().optional(),
  street: z.string().optional(),
  zipCity: z.string().optional(),
  zoomLink: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface SavedSignature {
  id: string
  name?: string | null
  company: string
  firstName: string
  lastName: string
  position: string
  phone?: string | null
  fax?: string | null
  mobile?: string | null
  whatsapp?: string | null
  email: string
  website?: string | null
  photoUrl?: string | null
  banners?: string | null
  logoUrl?: string | null
  showStandorte?: boolean
  legalCompanies?: string | null
  street?: string | null
  zipCity?: string | null
  zoomLink?: string | null
}

// ── Upload-Feld für Profilfoto ──────────────────────────────────────────────
function PhotoUploadField({
  inputRef, value, isDragging,
  onDragOver, onDragLeave, onDrop, onChange, onRemove,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string; isDragging: boolean
  onDragOver: () => void; onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        Profilfoto <span className="text-zinc-400 font-normal">(optional)</span>
      </label>
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
      {value ? (
        <div className="flex flex-col items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg h-[104px] justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Vorschau" className="w-14 h-14 rounded-full object-cover border-2 border-[#DCFF0C]" />
          <button type="button" onClick={onRemove}
            className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors">
            <X size={12} /> Entfernen
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); onDragOver() }}
          onDragEnter={(e) => { e.preventDefault(); onDragOver() }}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`w-full h-[104px] flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg text-sm transition-all ${
            isDragging ? 'border-[#DCFF0C] bg-[#DCFF0C]/5 text-zinc-800' : 'border-zinc-200 text-zinc-500 hover:border-[#DCFF0C]/50 hover:text-zinc-700'
          }`}>
          <Upload size={18} className={isDragging ? 'text-[#DCFF0C]' : ''} />
          <span>{isDragging ? 'Datei loslassen' : 'Foto hochladen'}</span>
          <span className="text-xs text-zinc-400">JPG, PNG · Drag & Drop oder Klick</span>
        </button>
      )}
    </div>
  )
}

// ── Banner-Liste ─────────────────────────────────────────────────────────────
function BannerList({ banners, onChange }: { banners: string[]; onChange: (b: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function readFile(file: File) {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        const maxW = 600
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const cv = document.createElement('canvas')
        cv.width = w; cv.height = h
        cv.getContext('2d')?.drawImage(img, 0, 0, w, h)
        onChange([...banners, cv.toDataURL('image/jpeg', 0.82)])
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }

  function moveUp(i: number) {
    if (i === 0) return
    const next = [...banners]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next)
  }
  function moveDown(i: number) {
    if (i === banners.length - 1) return
    const next = [...banners]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; onChange(next)
  }
  function remove(i: number) { onChange(banners.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700">
        Banner-Bilder <span className="text-zinc-400 font-normal">(optional, mehrere möglich – z. B. Premio)</span>
      </label>
      {banners.map((url, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Banner ${i + 1}`} className="h-10 w-auto max-w-[100px] object-contain rounded border border-zinc-100" />
          <div className="flex-1 text-xs text-zinc-400">Banner {i + 1}</div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => moveUp(i)} disabled={i === 0}
              className="p-1.5 rounded hover:bg-zinc-200 disabled:opacity-30 transition-colors"><ArrowUp size={13} /></button>
            <button type="button" onClick={() => moveDown(i)} disabled={i === banners.length - 1}
              className="p-1.5 rounded hover:bg-zinc-200 disabled:opacity-30 transition-colors"><ArrowDown size={13} /></button>
            <button type="button" onClick={() => remove(i)}
              className="p-1.5 rounded hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"><X size={13} /></button>
          </div>
        </div>
      ))}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { if (e.target.files?.[0]) { readFile(e.target.files[0]); e.target.value = '' } }} />
      <button type="button" onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) readFile(e.dataTransfer.files[0]) }}
        className={`w-full h-14 flex items-center justify-center gap-2 border-2 border-dashed rounded-lg text-sm transition-all ${
          isDragging ? 'border-[#DCFF0C] bg-[#DCFF0C]/5 text-zinc-800' : 'border-zinc-200 text-zinc-500 hover:border-[#DCFF0C]/50'
        }`}>
        <Plus size={15} /> Banner hinzufügen
      </button>
    </div>
  )
}

// ── Hauptkomponente ──────────────────────────────────────────────────────────
export default function SignaturenPage() {
  const [activeTab, setActiveTab] = useState<'generator' | 'anleitung'>('generator')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([])
  const [savedListOpen, setSavedListOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [standorte, setStandorte] = useState<string[]>([])
  const [availableLogos, setAvailableLogos] = useState<CompanyLogo[]>([])
  const [selectedLogoUrl, setSelectedLogoUrl] = useState<string>('')
  const [banners, setBanners] = useState<string[]>([])
  const [legalCompanies, setLegalCompanies] = useState<CompanyKey[]>(['raederlogistik'])
  const photoInputRef = useRef<HTMLInputElement>(null)

  const {
    register, watch, setValue, handleSubmit, reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', company: 'raederlogistik' as CompanyKey,
      firstName: '', lastName: '', position: '',
      phone: '', fax: '', mobile: '', whatsapp: '',
      email: '', website: '', photoUrl: '',
      showStandorte: true,
      street: '', zipCity: '', zoomLink: '',
    },
  })

  const formValues = watch()

  useEffect(() => {
    setLegalCompanies(prev => prev.length === 0 ? [formValues.company as CompanyKey] : prev)
  }, [formValues.company])

  const signatureData: SignatureData = {
    company: formValues.company as CompanyKey,
    firstName: formValues.firstName || 'Vorname',
    lastName: formValues.lastName || 'Nachname',
    position: formValues.position || 'Position',
    phone: formValues.phone || undefined,
    fax: formValues.fax || undefined,
    mobile: formValues.mobile || undefined,
    whatsapp: formValues.whatsapp || undefined,
    email: formValues.email || 'email@beispiel.de',
    website: formValues.website || undefined,
    photoUrl: formValues.photoUrl || undefined,
    banners: banners.length > 0 ? banners : undefined,
    logoUrl: selectedLogoUrl || undefined,
    showStandorte: formValues.showStandorte,
    legalCompanies: legalCompanies.length > 0 ? legalCompanies : undefined,
    street: formValues.street || undefined,
    zipCity: formValues.zipCity || undefined,
    zoomLink: formValues.zoomLink || undefined,
  }

  const loadSavedSignatures = useCallback(async () => {
    try {
      const res = await fetch('/api/signatures')
      if (res.ok) setSavedSignatures(await res.json())
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    loadSavedSignatures()
    fetch('/api/standorte').then(r => r.json())
      .then(d => { if (d.cities) setStandorte(d.cities) }).catch(() => {})
  }, [loadSavedSignatures])

  useEffect(() => {
    const company = formValues.company as CompanyKey
    if (!company) return
    fetch(`/api/logos?company=${company}`)
      .then(r => r.json())
      .then((logos: CompanyLogo[]) => {
        setAvailableLogos(logos)
        const active = logos.find(l => l.isActive)
        setSelectedLogoUrl(active?.filePath || COMPANY_CONFIG[company]?.logo || '')
      }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.company])

  const handleFileRead = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new window.Image()
      img.onload = () => {
        const maxSize = 220
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d')?.drawImage(img, 0, 0, w, h)
        setValue('photoUrl', canvas.toDataURL('image/jpeg', 0.82))
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }, [setValue])

  const handleCopyHTML = useCallback(async () => {
    const html = generateSignatureHTMLSync(signatureData, standorte, window.location.origin)
    try {
      await navigator.clipboard.writeText(html)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = html
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }, [signatureData, standorte])

  const handleSave = useCallback(async (data: FormValues) => {
    try {
      const payload = {
        ...data,
        banners: JSON.stringify(banners),
        legalCompanies: JSON.stringify(legalCompanies),
        logoUrl: selectedLogoUrl || null,
      }
      // Gleichnamige Signatur → überschreiben (PUT), sonst neu anlegen (POST)
      const existing = data.name?.trim()
        ? savedSignatures.find(s => s.name?.toLowerCase() === data.name!.trim().toLowerCase())
        : null
      const res = await fetch('/api/signatures', {
        method: existing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(existing ? { ...payload, id: existing.id } : payload),
      })
      if (res.ok) {
        setSaved(true); setTimeout(() => setSaved(false), 3000)
        await loadSavedSignatures(); setSavedListOpen(true)
      }
    } catch { /* ignore */ }
  }, [loadSavedSignatures, banners, legalCompanies, selectedLogoUrl, savedSignatures])

  const handleLoadSignature = useCallback((sig: SavedSignature) => {
    reset({
      name: sig.name || '', company: sig.company as CompanyKey,
      firstName: sig.firstName, lastName: sig.lastName, position: sig.position,
      phone: sig.phone || '', fax: sig.fax || '', mobile: sig.mobile || '',
      whatsapp: sig.whatsapp || '', email: sig.email, website: sig.website || '',
      photoUrl: sig.photoUrl || '', showStandorte: sig.showStandorte !== false,
      street: sig.street || '', zipCity: sig.zipCity || '', zoomLink: sig.zoomLink || '',
    })
    if (sig.logoUrl) setSelectedLogoUrl(sig.logoUrl)
    try { if (sig.banners) setBanners(JSON.parse(sig.banners)) } catch { setBanners([]) }
    try { if (sig.legalCompanies) setLegalCompanies(JSON.parse(sig.legalCompanies)) } catch { setLegalCompanies([sig.company as CompanyKey]) }
  }, [reset])

  const handleDeleteSignature = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/signatures?id=${id}`, { method: 'DELETE' })
      if (res.ok) await loadSavedSignatures()
    } catch { /* ignore */ } finally { setDeletingId(null) }
  }, [loadSavedSignatures])

  const inputClass = "w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"

  function toggleLegalCompany(key: CompanyKey) {
    setLegalCompanies(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#DCFF0C]">
        <div className="max-w-[1600px] mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-zinc-900 text-2xl font-bold tracking-tight">E-Mail Signatur Generator</h1>
            <p className="text-zinc-500 text-sm mt-0.5">Erstelle deine professionelle E-Mail-Signatur</p>
          </div>
          <Link href="/signaturen/anleitung"
            className="flex items-center gap-2 bg-[#DCFF0C] text-zinc-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#c8ec00] transition-colors">
            <BookOpen size={16} /> Outlook-Anleitung
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1600px] mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-white border border-zinc-200 rounded-xl p-1 w-fit shadow-sm">
          {([
            { id: 'generator', label: 'Generator', icon: Pen },
            { id: 'anleitung', label: 'Outlook-Anleitung', icon: BookOpen },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id ? 'bg-[#DCFF0C] text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}>
              <Icon size={15} />{label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'generator' && (
          <motion.div key="generator"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">

            {/* Gespeicherte Signaturen – volle Breite */}
            {savedSignatures.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <button type="button" onClick={() => setSavedListOpen(!savedListOpen)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-6 rounded-full bg-zinc-300" />
                    <h2 className="font-semibold text-zinc-800">
                      Gespeicherte Signaturen
                      <span className="ml-2 text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                        {savedSignatures.length}
                      </span>
                    </h2>
                  </div>
                  {savedListOpen ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
                </button>
                <AnimatePresence>
                  {savedListOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="border-t border-zinc-100 divide-y divide-zinc-50">
                        {savedSignatures.map(sig => (
                          <div key={sig.id} className="flex items-center gap-4 px-6 py-3 hover:bg-zinc-50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-800 truncate">{sig.name || `${sig.firstName} ${sig.lastName}`}</p>
                              <p className="text-xs text-zinc-400 truncate">{sig.position} · {sig.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button type="button" onClick={() => handleLoadSignature(sig)}
                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-all">
                                <FolderOpen size={13} /> Laden
                              </button>
                              <button type="button" onClick={() => handleDeleteSignature(sig.id)}
                                disabled={deletingId === sig.id}
                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-red-500 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-red-200 transition-all disabled:opacity-50">
                                <Trash2 size={13} />
                                {deletingId === sig.id ? '...' : 'Löschen'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── 2-Spalten: Formular | Vorschau ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_660px] gap-6 items-start">

              {/* LINKS: Formular */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
                  <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
                  <h2 className="font-semibold text-zinc-800">Deine Daten</h2>
                </div>
                <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-5">

                  {/* Firma + Standorte-Toggle */}
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Firma <span className="text-red-500">*</span>
                      </label>
                      <select {...register('company')} className={inputClass}>
                        <option value="raederlogistik">Räderlogistik Franchise GmbH</option>
                        <option value="reifen-gerlach">Reifen Gerlach GmbH</option>
                        <option value="rtg">RTG GmbH</option>
                      </select>
                    </div>
                    <div className="flex items-end pb-0.5">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" {...register('showStandorte')} className="w-4 h-4 rounded accent-[#DCFF0C]" />
                        <div>
                          <p className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
                            <MapPin size={14} className="text-zinc-400" /> Standorte anzeigen
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {standorte.length > 0 ? `${standorte.length} Standorte geladen` : 'Fallback-Liste'}
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Logo + Profilfoto nebeneinander */}
                  <div className={`grid gap-5 ${availableLogos.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {availableLogos.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                          <Image size={14} className="inline mr-1.5 text-zinc-400" />
                          Logo-Variante
                        </label>
                        <div className="flex gap-3 flex-wrap">
                          {availableLogos.map(logo => (
                            <button key={logo.id} type="button" onClick={() => setSelectedLogoUrl(logo.filePath)}
                              className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg border-2 transition-all ${
                                selectedLogoUrl === logo.filePath ? 'border-[#DCFF0C] bg-[#DCFF0C]/5' : 'border-zinc-200 hover:border-zinc-300'
                              }`}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={logo.filePath} alt={logo.label} className="h-9 w-auto object-contain" />
                              <span className="text-xs text-zinc-600">{logo.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <PhotoUploadField
                      inputRef={photoInputRef}
                      value={formValues.photoUrl || ''}
                      isDragging={isDraggingPhoto}
                      onDragOver={() => setIsDraggingPhoto(true)}
                      onDragLeave={() => setIsDraggingPhoto(false)}
                      onDrop={e => { e.preventDefault(); setIsDraggingPhoto(false); if (e.dataTransfer.files?.[0]) handleFileRead(e.dataTransfer.files[0]) }}
                      onChange={e => { if (e.target.files?.[0]) handleFileRead(e.target.files[0]) }}
                      onRemove={() => { setValue('photoUrl', ''); if (photoInputRef.current) photoInputRef.current.value = '' }}
                    />
                  </div>

                  {/* Name + Position */}
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Vorname <span className="text-red-500">*</span></label>
                      <input {...register('firstName')} placeholder="Max" className={inputClass} />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Nachname <span className="text-red-500">*</span></label>
                      <input {...register('lastName')} placeholder="Mustermann" className={inputClass} />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Position <span className="text-red-500">*</span></label>
                      <input {...register('position')} placeholder="Vertriebsleiter" className={inputClass} />
                      {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
                    </div>
                  </div>

                  {/* Kontakt – 3-spaltig */}
                  <div className="grid grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Telefon</label>
                      <input {...register('phone')} placeholder="02103-9079441" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Mobil</label>
                      <input {...register('mobile')} placeholder="0170 1234567" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Fax</label>
                      <input {...register('fax')} placeholder="02103-398111" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        E-Mail <span className="text-red-500">*</span>
                      </label>
                      <input {...register('email')} type="email" placeholder="m.mustermann@raederlogistik.de" className={inputClass} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">WhatsApp</label>
                      <input {...register('whatsapp')} placeholder="0170 3698733" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Website</label>
                      <input {...register('website')} type="url" placeholder="https://www.raederlogistik.de/" className={inputClass} />
                      {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
                    </div>
                  </div>

                  {/* Adresse + Zoom */}
                  <div>
                    <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wide">
                      Standort-Adresse <span className="normal-case">(optional – für Franchise-Standorte)</span>
                    </p>
                    <div className="grid grid-cols-3 gap-5">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Straße</label>
                        <input {...register('street')} placeholder="z. B. Hauptstraße 12" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">PLZ + Ort</label>
                        <input {...register('zipCity')} placeholder="40721 Hilden" className={inputClass} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-zinc-700 mb-1.5">Zoom-Link</label>
                        <input {...register('zoomLink')} type="url" placeholder="https://us05web.zoom.us/j/..." className={inputClass} />
                      </div>
                    </div>
                  </div>

                  {/* Banner */}
                  <BannerList banners={banners} onChange={setBanners} />

                  {/* Rechtliche Angaben */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-5 rounded-full bg-[#DCFF0C]" />
                      <p className="text-sm font-semibold text-zinc-800">Rechtliche Angaben</p>
                      <span className="text-xs text-zinc-400">Welche Firmen sollen im Footer erscheinen?</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {ALL_COMPANIES.map(({ key, label }) => {
                        const c = COMPANY_CONFIG[key]
                        const checked = legalCompanies.includes(key)
                        return (
                          <label key={key}
                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                              checked ? 'border-[#DCFF0C] bg-[#DCFF0C]/5' : 'border-zinc-200 hover:border-zinc-300'
                            }`}>
                            <input type="checkbox" checked={checked} onChange={() => toggleLegalCompany(key)}
                              className="mt-0.5 w-4 h-4 rounded accent-[#DCFF0C] shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-zinc-800">{label}</p>
                              <p className="text-xs text-zinc-400 mt-0.5">{c.legal.ceo}</p>
                              <p className="text-xs text-zinc-400">{c.legal.vatId}</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Speichern */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <input {...register('name')} placeholder="Signatur-Name (optional)" className={inputClass} />
                    </div>
                    <button type="submit"
                      className="flex items-center gap-2 px-4 py-2.5 bg-zinc-700 text-white text-sm font-medium rounded-lg hover:bg-zinc-600 transition-colors whitespace-nowrap">
                      {saved ? <Check size={15} className="text-[#DCFF0C]" /> : <Save size={15} />}
                      {saved ? 'Gespeichert!' : 'Signatur speichern'}
                    </button>
                  </div>
                </form>
              </div>

              {/* RECHTS: Sticky E-Mail-Vorschau */}
              <div className="sticky top-6">
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                  {/* Vorschau-Header */}
                  <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-5 rounded-full bg-[#DCFF0C]" />
                      <h2 className="font-semibold text-zinc-800 text-sm">E-Mail-Vorschau</h2>
                    </div>
                    <span className="text-xs text-zinc-400 bg-zinc-50 px-2.5 py-1 rounded-full border border-zinc-100">Live</span>
                  </div>

                  {/* E-Mail-Mockup */}
                  <div className="bg-zinc-100 p-3">
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                      {/* E-Mail-Header */}
                      <div className="border-b border-zinc-100 px-4 py-3 space-y-1.5">
                        <div className="flex gap-3 text-xs">
                          <span className="text-zinc-400 w-12 shrink-0">Von</span>
                          <span className="text-zinc-700 font-medium truncate">
                            {(formValues.firstName || 'Vorname') + ' ' + (formValues.lastName || 'Nachname')}
                            {formValues.email ? ` <${formValues.email}>` : ' <email@beispiel.de>'}
                          </span>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <span className="text-zinc-400 w-12 shrink-0">An</span>
                          <span className="text-zinc-500">empfaenger@beispiel.de</span>
                        </div>
                        <div className="flex gap-3 text-xs">
                          <span className="text-zinc-400 w-12 shrink-0">Betreff</span>
                          <span className="text-zinc-700">Ihre Anfrage</span>
                        </div>
                      </div>
                      {/* E-Mail-Body */}
                      <div className="px-4 py-4">
                        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                          Sehr geehrte Damen und Herren,<br /><br />
                          vielen Dank für Ihre Nachricht.
                        </p>
                        <div className="border-t border-zinc-200 pt-4 overflow-x-auto">
                          <SignaturePreview data={signatureData} standorte={standorte} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Copy-Button */}
                  <div className="px-5 py-4 border-t border-zinc-100 flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-xs text-zinc-500">
                      HTML kopieren →{' '}
                      <Link href="/signaturen/anleitung" className="text-zinc-700 font-medium hover:underline">Outlook-Anleitung</Link>
                    </p>
                    <button onClick={handleCopyHTML}
                      className="flex items-center gap-2 bg-[#DCFF0C] text-zinc-900 font-semibold py-2 px-5 rounded-xl text-sm hover:bg-[#c8ec00] active:scale-[0.98] transition-all whitespace-nowrap">
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                            <Check size={15} /> HTML kopiert!
                          </motion.span>
                        ) : (
                          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                            <Copy size={15} /> HTML-Code kopieren
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {activeTab === 'anleitung' && (
          <motion.div key="anleitung"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto px-6 py-8">
            <AnleitungContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AnleitungContent() {
  return (
    <div className="space-y-8">
      {[
        {
          title: 'Outlook Windows (2016, 2019, 365)',
          steps: [
            { title: 'Optionen öffnen', desc: 'Klicke in Outlook auf Datei → Optionen.' },
            { title: 'E-Mail-Einstellungen', desc: 'Wähle in der linken Leiste den Punkt „E-Mail".' },
            { title: 'Signaturen verwalten', desc: 'Klicke auf die Schaltfläche „Signaturen…".' },
            { title: 'Neue Signatur erstellen', desc: 'Klicke auf „Neu", vergib einen Namen und bestätige mit OK.' },
            { title: 'HTML-Code einfügen', desc: 'Klicke mit der rechten Maustaste in das Signatur-Textfeld → „Quellcode anzeigen". Füge den kopierten HTML-Code ein.' },
            { title: 'Speichern', desc: 'Klicke auf OK und schließe alle Dialogfelder.' },
          ],
        },
        {
          title: 'Outlook Mac (Microsoft 365, neue Version)',
          steps: [
            { title: 'Einstellungen öffnen', desc: 'Klicke in der Menüleiste auf Outlook → Einstellungen (⌘,) → „Schreiben und Antworten".' },
            { title: 'Signaturen aufrufen', desc: 'Klicke auf „Signaturen". Es öffnet sich der Signatur-Editor.' },
            { title: 'Neue Signatur anlegen', desc: 'Klicke auf „+" (neu) und vergib einen Namen.' },
            { title: 'HTML einfügen – Methode 1', desc: 'Klicke ins leere Textfeld der Signatur. Dann im macOS-Menü oben: Bearbeiten → Als HTML einfügen. Den zuvor kopierten HTML-Code einfügen.' },
            { title: 'HTML einfügen – Methode 2 (falls Methode 1 fehlt)', desc: 'HTML-Code in eine Datei (z. B. signatur.html) speichern und in Safari öffnen. Dort alles markieren (⌘+A), kopieren (⌘+C) und direkt ins Signaturfeld einfügen (⌘+V).' },
            { title: 'Als Standard setzen & schließen', desc: 'Unter „Standardsignatur" das gewünschte Konto + diese Signatur auswählen. Fenster schließen.' },
          ],
        },
        {
          title: 'Outlook Mac (ältere Version 2016/2019)',
          steps: [
            { title: 'Einstellungen öffnen', desc: 'Klicke in der Menüleiste auf Outlook → Einstellungen (⌘,).' },
            { title: 'Signaturen aufrufen', desc: 'Klicke im Abschnitt „E-Mail" auf „Signaturen".' },
            { title: 'Neue Signatur anlegen', desc: 'Klicke unten links auf das „+"-Symbol und vergib einen Namen.' },
            { title: 'HTML-Code einfügen', desc: 'Klicke ins Bearbeitungsfeld der Signatur. Dann im macOS-Menü: Bearbeiten → Als HTML einfügen.' },
            { title: 'Speichern & schließen', desc: 'Klicke auf „Speichern" und schließe den Dialog.' },
          ],
        },
      ].map(({ title, steps }) => (
        <div key={title} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center gap-3">
            <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
            <h2 className="font-semibold text-zinc-900">{title}</h2>
          </div>
          <ol className="divide-y divide-zinc-100">
            {steps.map(({ title: t, desc }, i) => (
              <li key={i} className="flex gap-5 px-6 py-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DCFF0C] text-zinc-900 flex items-center justify-center font-bold text-sm mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-semibold text-zinc-800 text-sm">{t}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
