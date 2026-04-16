'use client'

import { useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Upload, X, Save, BookOpen, Pen } from 'lucide-react'
import Link from 'next/link'
import SignaturePreview from '@/components/SignaturePreview'
import { SignatureData, generateSignatureHTMLSync } from '@/lib/signature-export'

const schema = z.object({
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
})

type FormValues = z.infer<typeof schema>

export default function SignaturenPage() {
  const [activeTab, setActiveTab] = useState<'generator' | 'anleitung'>('generator')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
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
  }

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setValue('photoUrl', event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }, [setValue])

  const handleCopyHTML = useCallback(async () => {
    const html = generateSignatureHTMLSync(signatureData, '', window.location.origin)
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = html
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
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
      }
    } catch {
      // ignore
    }
  }, [])

  const inputClass = "w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b-4 border-[#DCFF0C]">
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
                  ? 'bg-[#1a1a1a] text-[#DCFF0C] shadow-sm'
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
            {/* Form */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
                <h2 className="font-semibold text-zinc-800">Deine Daten</h2>
              </div>
              <form onSubmit={handleSubmit(handleSave)} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Company */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Firma <span className="text-red-500">*</span>
                    </label>
                    <select {...register('company')} className={inputClass}>
                      <option value="raederlogistik">Räderlogistik Franchise GmbH</option>
                      <option value="reifen-gerlach">Reifen Gerlach GmbH</option>
                    </select>
                  </div>

                  {/* Photo */}
                  <div className="row-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Foto <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    {formValues.photoUrl ? (
                      <div className="flex flex-col items-center gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-lg h-[104px] justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formValues.photoUrl} alt="Vorschau" className="w-14 h-14 rounded-full object-cover border-2 border-[#DCFF0C]" />
                        <button type="button" onClick={() => { setValue('photoUrl', ''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                          className="text-xs text-zinc-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                          <X size={12} /> Entfernen
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="w-full h-[104px] flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-lg text-sm text-zinc-500 hover:border-[#DCFF0C]/50 hover:text-zinc-700 transition-all">
                        <Upload size={18} />
                        <span>Foto hochladen</span>
                        <span className="text-xs text-zinc-400">JPG, PNG</span>
                      </button>
                    )}
                  </div>

                  {/* Vorname */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Vorname <span className="text-red-500">*</span>
                    </label>
                    <input {...register('firstName')} placeholder="Max" className={inputClass} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>

                  {/* Nachname */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Nachname <span className="text-red-500">*</span>
                    </label>
                    <input {...register('lastName')} placeholder="Mustermann" className={inputClass} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input {...register('position')} placeholder="Vertriebsleiter" className={inputClass} />
                    {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Telefon</label>
                    <input {...register('phone')} placeholder="+49 2103 123456" className={inputClass} />
                  </div>

                  {/* Mobil */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Mobil</label>
                    <input {...register('mobile')} placeholder="+49 170 1234567" className={inputClass} />
                  </div>

                  {/* Fax */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Fax</label>
                    <input {...register('fax')} placeholder="+49 2103 123457" className={inputClass} />
                  </div>

                  {/* E-Mail */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      E-Mail <span className="text-red-500">*</span>
                    </label>
                    <input {...register('email')} type="email" placeholder="m.mustermann@raederlogistik.de" className={inputClass} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Website <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input {...register('website')} type="url" placeholder="https://www.raederlogistik.de/" className={inputClass} />
                    {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-zinc-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    {saved ? <Check size={15} className="text-[#DCFF0C]" /> : <Save size={15} />}
                    {saved ? 'Gespeichert!' : 'In Datenbank speichern'}
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
                <span className="text-xs text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                  Live-Vorschau
                </span>
              </div>

              {/* Fake E-Mail Client */}
              <div className="bg-zinc-100 p-4">
                <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                  {/* E-Mail Header */}
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

                  {/* E-Mail Body */}
                  <div className="px-5 py-5">
                    <p className="text-sm text-zinc-600 mb-6">
                      Sehr geehrte Damen und Herren,<br /><br />
                      vielen Dank für Ihre Nachricht. Wir melden uns schnellstmöglich bei Ihnen.
                    </p>

                    {/* Divider */}
                    <div className="border-t border-zinc-200 pt-5">
                      <SignaturePreview data={signatureData} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Export */}
              <div className="px-6 py-5 border-t border-zinc-100 flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm text-zinc-500">
                  HTML-Code kopieren und direkt in Outlook als Signatur einfügen.
                  <Link href="/signaturen/anleitung" className="text-zinc-800 font-medium ml-1 hover:underline">
                    Anleitung →
                  </Link>
                </p>
                <button
                  onClick={handleCopyHTML}
                  className="flex items-center gap-2 bg-[#DCFF0C] text-[#1a1a1a] font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#c9eb0b] active:scale-[0.98] transition-all whitespace-nowrap"
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
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#1a1a1a] flex items-center gap-3">
          <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
          <h2 className="font-semibold text-white">Outlook Windows (2016, 2019, 365)</h2>
        </div>
        <ol className="divide-y divide-zinc-100">
          {[
            { step: 1, title: 'Optionen öffnen', desc: 'Klicke in Outlook auf Datei → Optionen.' },
            { step: 2, title: 'E-Mail-Einstellungen', desc: 'Wähle in der linken Leiste den Punkt „E-Mail".' },
            { step: 3, title: 'Signaturen verwalten', desc: 'Klicke auf die Schaltfläche „Signaturen…".' },
            { step: 4, title: 'Neue Signatur erstellen', desc: 'Klicke auf „Neu", vergib einen Namen und bestätige mit OK.' },
            { step: 5, title: 'HTML-Code einfügen', desc: 'Klicke mit der rechten Maustaste in das Signatur-Textfeld → „Quellcode anzeigen". Füge den kopierten HTML-Code ein.' },
            { step: 6, title: 'Speichern', desc: 'Klicke auf OK und schließe alle Dialogfelder.' },
          ].map(({ step, title, desc }) => (
            <li key={step} className="flex gap-5 px-6 py-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DCFF0C] text-[#1a1a1a] flex items-center justify-center font-bold text-sm mt-0.5">{step}</span>
              <div>
                <p className="font-semibold text-zinc-800 text-sm">{title}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-[#1a1a1a] flex items-center gap-3">
          <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
          <h2 className="font-semibold text-white">Outlook Mac (2016, 2019, 365)</h2>
        </div>
        <ol className="divide-y divide-zinc-100">
          {[
            { step: 1, title: 'Einstellungen öffnen', desc: 'Klicke in der Menüleiste auf Outlook → Einstellungen (⌘,).' },
            { step: 2, title: 'Signaturen aufrufen', desc: 'Klicke im Abschnitt „E-Mail" auf „Signaturen".' },
            { step: 3, title: 'Neue Signatur anlegen', desc: 'Klicke unten links auf das „+"-Symbol.' },
            { step: 4, title: 'Name vergeben', desc: 'Gib der Signatur einen Namen.' },
            { step: 5, title: 'HTML-Code einfügen', desc: 'Klicke in das Bearbeitungsfeld → Bearbeiten → Als HTML einfügen.' },
            { step: 6, title: 'Speichern & schließen', desc: 'Klicke auf „Speichern" und schließe den Dialog.' },
          ].map(({ step, title, desc }) => (
            <li key={step} className="flex gap-5 px-6 py-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DCFF0C] text-[#1a1a1a] flex items-center justify-center font-bold text-sm mt-0.5">{step}</span>
              <div>
                <p className="font-semibold text-zinc-800 text-sm">{title}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
