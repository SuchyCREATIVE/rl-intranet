'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy, Check, Upload, X, Save, BookOpen, Pen,
  Trash2, FolderOpen, ChevronDown, ChevronUp, Image,
} from 'lucide-react'
import Link from 'next/link'
import QRCode from 'qrcode'
import SignaturePreview from '@/components/SignaturePreview'
import { SignatureData, COMPANY_CONFIG, buildVCard, generateSignatureHTMLSync } from '@/lib/signature-export'

const schema = z.object({
  name: z.string().optional(),
  company: z.enum(['raederlogistik', 'reifen-gerlach']),
  firstName: z.string().min(1, 'Vorname ist erforderlich'),
  lastName: z.string().min(1, 'Nachname ist erforderlich'),
  position: z.string().min(1, 'Position ist erforderlich'),
  phone: z.string().optional(),
  fax: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  website: z.string().url('Gültige URL erforderlich').optional().or(z.literal('')),
  photoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
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
  email: string
  website?: string | null
  photoUrl?: string | null
  bannerUrl?: string | null
}

interface UploadFieldProps {
  field: 'photoUrl' | 'bannerUrl'
  label: string
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string
  isDragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
  previewRound?: boolean
}

function UploadField({
  field, label, inputRef, value, isDragging,
  onDragOver, onDragLeave, onDrop, onChange, onRemove,
  previewRound = false,
}: UploadFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
        {label} <span className="text-zinc-400 font-normal">(optional)</span>
      </label>
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
      {value ? (
        <div className={`flex ${field === 'bannerUrl' ? 'flex-row' : 'flex-col'} items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg h-[104px] justify-center`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Vorschau"
            className={`object-cover border-2 border-[#DCFF0C] ${previewRound ? 'w-14 h-14 rounded-full' : 'h-14 w-auto max-w-[200px] rounded'}`}
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <X size={12} /> Entfernen
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); onDragOver(e) }}
          onDragEnter={(e) => { e.preventDefault(); onDragOver(e) }}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`w-full h-[104px] flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg text-sm transition-all ${
            isDragging
              ? 'border-[#DCFF0C] bg-[#DCFF0C]/5 text-zinc-800'
              : 'border-zinc-200 text-zinc-500 hover:border-[#DCFF0C]/50 hover:text-zinc-700'
          }`}
        >
          {field === 'bannerUrl' ? <Image size={18} className={isDragging ? 'text-[#DCFF0C]' : ''} /> : <Upload size={18} className={isDragging ? 'text-[#DCFF0C]' : ''} />}
          <span>{isDragging ? 'Datei loslassen' : field === 'bannerUrl' ? 'Banner hochladen' : 'Foto hochladen'}</span>
          <span className="text-xs text-zinc-400">JPG, PNG · Drag & Drop oder Klick</span>
        </button>
      )}
    </div>
  )
}

export default function SignaturenPage() {
  const [activeTab, setActiveTab] = useState<'generator' | 'anleitung'>('generator')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false)
  const [isDraggingBanner, setIsDraggingBanner] = useState(false)
  const [savedSignatures, setSavedSignatures] = useState<SavedSignature[]>([])
  const [savedListOpen, setSavedListOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      company: 'raederlogistik',
      firstName: '',
      lastName: '',
      position: '',
      phone: '',
      fax: '',
      mobile: '',
      email: '',
      website: '',
      photoUrl: '',
      bannerUrl: '',
    },
  })

  const formValues = watch()

  const signatureData: SignatureData = {
    company: formValues.company,
    firstName: formValues.firstName || 'Vorname',
    lastName: formValues.lastName || 'Nachname',
    position: formValues.position || 'Position',
    phone: formValues.phone || undefined,
    fax: formValues.fax || undefined,
    mobile: formValues.mobile || undefined,
    email: formValues.email || 'email@beispiel.de',
    website: formValues.website || undefined,
    photoUrl: formValues.photoUrl || undefined,
    bannerUrl: formValues.bannerUrl || undefined,
  }

  const loadSavedSignatures = useCallback(async () => {
    try {
      const res = await fetch('/api/signatures')
      if (res.ok) setSavedSignatures(await res.json())
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    loadSavedSignatures()
  }, [loadSavedSignatures])

  // Foto-Upload
  const handleFileRead = useCallback((file: File, field: 'photoUrl' | 'bannerUrl') => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setValue(field, e.target?.result as string)
    reader.readAsDataURL(file)
  }, [setValue])

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileRead(e.target.files[0], 'photoUrl')
  }, [handleFileRead])

  const handleBannerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileRead(e.target.files[0], 'bannerUrl')
  }, [handleFileRead])

  const handleCopyHTML = useCallback(async () => {
    const company = COMPANY_CONFIG[signatureData.company]
    const vCard = buildVCard(signatureData, company)
    let qrCodeDataUrl = ''
    try {
      qrCodeDataUrl = await QRCode.toDataURL(vCard, { width: 76, margin: 1 })
    } catch { /* ignore */ }
    const html = generateSignatureHTMLSync(signatureData, qrCodeDataUrl, window.location.origin)
    try {
      await navigator.clipboard.writeText(html)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = html
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }, [signatureData])

  const handleSave = useCallback(async (data: FormValues) => {
    try {
      const res = await fetch('/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
        await loadSavedSignatures()
        setSavedListOpen(true)
      }
    } catch { /* ignore */ }
  }, [loadSavedSignatures])

  const handleLoadSignature = useCallback((sig: SavedSignature) => {
    reset({
      name: sig.name || '',
      company: sig.company as 'raederlogistik' | 'reifen-gerlach',
      firstName: sig.firstName,
      lastName: sig.lastName,
      position: sig.position,
      phone: sig.phone || '',
      fax: sig.fax || '',
      mobile: sig.mobile || '',
      email: sig.email,
      website: sig.website || '',
      photoUrl: sig.photoUrl || '',
      bannerUrl: sig.bannerUrl || '',
    })
  }, [reset])

  const handleDeleteSignature = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/signatures?id=${id}`, { method: 'DELETE' })
      if (res.ok) await loadSavedSignatures()
    } catch { /* ignore */ } finally {
      setDeletingId(null)
    }
  }, [loadSavedSignatures])

  const inputClass = "w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-[#1c1c1c] border-b-4 border-[#DCFF0C]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">E-Mail Signatur Generator</h1>
            <p className="text-zinc-400 text-sm mt-0.5">Erstelle deine professionelle E-Mail-Signatur</p>
          </div>
          <Link
            href="/signaturen/anleitung"
            className="flex items-center gap-2 text-[#DCFF0C] text-sm font-medium border border-[#DCFF0C]/40 px-4 py-2 rounded-lg hover:bg-[#DCFF0C]/10 transition-colors"
          >
            <BookOpen size={16} />
            Outlook-Anleitung
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-white border border-zinc-200 rounded-xl p-1 w-fit shadow-sm">
          {([
            { id: 'generator', label: 'Generator', icon: Pen },
            { id: 'anleitung', label: 'Outlook-Anleitung', icon: BookOpen },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-[#1c1c1c] text-[#DCFF0C] shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'generator' && (
          <motion.div
            key="generator"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto px-6 py-6 space-y-6"
          >

            {/* Gespeicherte Signaturen */}
            {savedSignatures.length > 0 && (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSavedListOpen(!savedListOpen)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 transition-colors"
                >
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
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-zinc-100 divide-y divide-zinc-50">
                        {savedSignatures.map((sig) => (
                          <div key={sig.id} className="flex items-center gap-4 px-6 py-3 hover:bg-zinc-50 transition-colors">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-800 truncate">
                                {sig.name || `${sig.firstName} ${sig.lastName}`}
                              </p>
                              <p className="text-xs text-zinc-400 truncate">
                                {sig.position} · {sig.email}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleLoadSignature(sig)}
                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-all"
                              >
                                <FolderOpen size={13} /> Laden
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSignature(sig.id)}
                                disabled={deletingId === sig.id}
                                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-red-500 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-red-200 transition-all disabled:opacity-50"
                              >
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

            {/* Formular */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
                <h2 className="font-semibold text-zinc-800">Deine Daten</h2>
              </div>
              <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-6">

                {/* Firma */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    Firma <span className="text-red-500">*</span>
                  </label>
                  <select {...register('company')} className={inputClass}>
                    <option value="raederlogistik">Räderlogistik Franchise GmbH</option>
                    <option value="reifen-gerlach">Reifen Gerlach GmbH</option>
                  </select>
                </div>

                {/* Name + Position */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Vorname <span className="text-red-500">*</span>
                    </label>
                    <input {...register('firstName')} placeholder="Max" className={inputClass} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Nachname <span className="text-red-500">*</span>
                    </label>
                    <input {...register('lastName')} placeholder="Mustermann" className={inputClass} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input {...register('position')} placeholder="Vertriebsleiter" className={inputClass} />
                    {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
                  </div>
                </div>

                {/* Kontakt */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Telefon</label>
                    <input {...register('phone')} placeholder="+49 2103 123456" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Mobil</label>
                    <input {...register('mobile')} placeholder="+49 170 1234567" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Fax</label>
                    <input {...register('fax')} placeholder="+49 2103 123457" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      E-Mail <span className="text-red-500">*</span>
                    </label>
                    <input {...register('email')} type="email" placeholder="m.mustermann@raederlogistik.de" className={inputClass} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Website <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input {...register('website')} type="url" placeholder="https://www.raederlogistik.de/" className={inputClass} />
                    {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
                  </div>
                </div>

                {/* Fotos / Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <UploadField
                    field="photoUrl"
                    label="Profilfoto"
                    inputRef={photoInputRef}
                    value={formValues.photoUrl || ''}
                    isDragging={isDraggingPhoto}
                    onDragOver={() => setIsDraggingPhoto(true)}
                    onDragLeave={() => setIsDraggingPhoto(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDraggingPhoto(false); if (e.dataTransfer.files?.[0]) handleFileRead(e.dataTransfer.files[0], 'photoUrl') }}
                    onChange={handlePhotoChange}
                    onRemove={() => { setValue('photoUrl', ''); if (photoInputRef.current) photoInputRef.current.value = '' }}
                    previewRound
                  />
                  <UploadField
                    field="bannerUrl"
                    label="Banner-Bild (z. B. Premio)"
                    inputRef={bannerInputRef}
                    value={formValues.bannerUrl || ''}
                    isDragging={isDraggingBanner}
                    onDragOver={() => setIsDraggingBanner(true)}
                    onDragLeave={() => setIsDraggingBanner(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDraggingBanner(false); if (e.dataTransfer.files?.[0]) handleFileRead(e.dataTransfer.files[0], 'bannerUrl') }}
                    onChange={handleBannerChange}
                    onRemove={() => { setValue('bannerUrl', ''); if (bannerInputRef.current) bannerInputRef.current.value = '' }}
                  />
                </div>

                {/* Speichern */}
                <div className="pt-4 border-t border-zinc-100 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <input
                      {...register('name')}
                      placeholder="Signatur-Name (optional)"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
                  >
                    {saved ? <Check size={15} className="text-[#DCFF0C]" /> : <Save size={15} />}
                    {saved ? 'Gespeichert!' : 'Signatur speichern'}
                  </button>
                </div>
              </form>
            </div>

            {/* E-Mail Vorschau */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
                  <h2 className="font-semibold text-zinc-800">Vorschau</h2>
                </div>
                <span className="text-xs text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">Live-Vorschau</span>
              </div>

              <div className="bg-zinc-100 p-4">
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                  {/* E-Mail-Header */}
                  <div className="border-b border-zinc-100 px-5 py-4 space-y-2">
                    <div className="flex gap-3 text-sm">
                      <span className="text-zinc-400 w-14 shrink-0">Von</span>
                      <span className="text-zinc-700 font-medium">
                        {(formValues.firstName || 'Vorname') + ' ' + (formValues.lastName || 'Nachname')}
                        {formValues.email ? ` <${formValues.email}>` : ' <email@beispiel.de>'}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className="text-zinc-400 w-14 shrink-0">An</span>
                      <span className="text-zinc-500">empfaenger@beispiel.de</span>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <span className="text-zinc-400 w-14 shrink-0">Betreff</span>
                      <span className="text-zinc-700">Ihre Anfrage</span>
                    </div>
                  </div>

                  {/* E-Mail-Body */}
                  <div className="px-5 py-5">
                    <p className="text-sm text-zinc-600 mb-6">
                      Sehr geehrte Damen und Herren,<br /><br />
                      vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich bei Ihnen.
                    </p>
                    <div className="border-t border-zinc-200 pt-5">
                      <SignaturePreview data={signatureData} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Export */}
              <div className="px-6 py-5 border-t border-zinc-100 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-zinc-500">
                  HTML-Code kopieren und in Outlook als Signatur einfügen.
                  <Link href="/signaturen/anleitung" className="text-zinc-800 font-medium ml-1 hover:underline">
                    Anleitung →
                  </Link>
                </p>
                <button
                  onClick={handleCopyHTML}
                  className="flex items-center gap-2 bg-[#DCFF0C] text-[#1c1c1c] font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#c8ec00] active:scale-[0.98] transition-all whitespace-nowrap"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                        <Check size={16} /> HTML kopiert!
                      </motion.span>
                    ) : (
                      <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                        <Copy size={16} /> HTML-Code kopieren
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'anleitung' && (
          <motion.div
            key="anleitung"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-3xl mx-auto px-6 py-8"
          >
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
          title: 'Outlook Mac (2016, 2019, 365)',
          steps: [
            { title: 'Einstellungen öffnen', desc: 'Klicke in der Menüleiste auf Outlook → Einstellungen (⌘,).' },
            { title: 'Signaturen aufrufen', desc: 'Klicke im Abschnitt „E-Mail" auf „Signaturen".' },
            { title: 'Neue Signatur anlegen', desc: 'Klicke unten links auf das „+"-Symbol.' },
            { title: 'Name vergeben', desc: 'Gib der Signatur einen Namen.' },
            { title: 'HTML-Code einfügen', desc: 'Klicke in das Bearbeitungsfeld → Bearbeiten → Als HTML einfügen.' },
            { title: 'Speichern & schließen', desc: 'Klicke auf „Speichern" und schließe den Dialog.' },
          ],
        },
      ].map(({ title, steps }) => (
        <div key={title} className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-[#1c1c1c] flex items-center gap-3">
            <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
            <h2 className="font-semibold text-white">{title}</h2>
          </div>
          <ol className="divide-y divide-zinc-100">
            {steps.map(({ title: t, desc }, i) => (
              <li key={i} className="flex gap-5 px-6 py-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DCFF0C] text-[#1c1c1c] flex items-center justify-center font-bold text-sm mt-0.5">{i + 1}</span>
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
