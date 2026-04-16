'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Upload, X, Save, BookOpen, Pen } from 'lucide-react'
import Link from 'next/link'
import SignaturePreview from '@/components/SignaturePreview'
import { SignatureData, generateSignatureHTMLSync } from '@/lib/signature-export'
import QRCode from 'qrcode'

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

const COMPANY_WEBSITES: Record<string, string> = {
  'raederlogistik': 'https://www.raederlogistik.de/',
  'reifen-gerlach': 'https://www.raederlogistik.de/',
}

export default function SignaturenPage() {
  const [activeTab, setActiveTab] = useState<'generator' | 'anleitung'>('generator')
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
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

  const websiteUrl = signatureData.website || COMPANY_WEBSITES[signatureData.company]

  useEffect(() => {
    let cancelled = false
    QRCode.toDataURL(websiteUrl, {
      width: 80,
      margin: 1,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    }).then((url) => {
      if (!cancelled) setQrCodeDataUrl(url)
    }).catch(() => {
      if (!cancelled) setQrCodeDataUrl(
        `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(websiteUrl)}`
      )
    })
    return () => { cancelled = true }
  }, [websiteUrl])

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
    const html = generateSignatureHTMLSync(signatureData, qrCodeDataUrl, window.location.origin)
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = html
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }, [signatureData, qrCodeDataUrl])

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

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b-4 border-[#DCFF0C]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">E-Mail Signatur Generator</h1>
            <p className="text-zinc-400 text-sm mt-0.5">Erstelle deine professionelle E-Mail-Signatur</p>
          </div>
          <Link
            href="/signaturen/anleitung"
            className="flex items-center gap-2 text-[#DCFF0C] text-sm font-medium border border-[#DCFF0C]/40 px-4 py-2 rounded-lg hover:bg-[#DCFF0C]/10 transition-colors"
          >
            <BookOpen size={16} />
            Anleitung: Signatur in Outlook einrichten
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
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
            className="max-w-7xl mx-auto px-6 py-6"
          >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Form */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 flex items-center gap-3">
                  <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
                  <h2 className="font-semibold text-zinc-800">Deine Daten</h2>
                </div>
                <form onSubmit={handleSubmit(handleSave)} className="p-6 space-y-5">
                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Firma <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('company')}
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                    >
                      <option value="raederlogistik">Räderlogistik Franchise GmbH</option>
                      <option value="reifen-gerlach">Reifen Gerlach GmbH</option>
                    </select>
                  </div>

                  {/* Name Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Vorname <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('firstName')}
                        placeholder="Max"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Nachname <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('lastName')}
                        placeholder="Mustermann"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('position')}
                      placeholder="Vertriebsleiter"
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                    />
                    {errors.position && (
                      <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
                    )}
                  </div>

                  {/* Phone + Mobile */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Telefon</label>
                      <input
                        {...register('phone')}
                        placeholder="+49 2103 123456"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1.5">Mobil</label>
                      <input
                        {...register('mobile')}
                        placeholder="+49 170 1234567"
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Fax */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Fax</label>
                    <input
                      {...register('fax')}
                      placeholder="+49 2103 123457"
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      E-Mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="m.mustermann@raederlogistik.de"
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Website <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      {...register('website')}
                      type="url"
                      placeholder="https://www.raederlogistik.de/"
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[#DCFF0C]/50 focus:border-zinc-300 transition-all"
                    />
                    {errors.website && (
                      <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
                    )}
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                      Foto <span className="text-zinc-400 font-normal">(optional)</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    {formValues.photoUrl ? (
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formValues.photoUrl}
                          alt="Vorschau"
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#DCFF0C]"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-zinc-700 font-medium">Foto hochgeladen</p>
                          <p className="text-xs text-zinc-400">Wird als Kreis-Bild angezeigt</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setValue('photoUrl', ''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 rounded-lg py-4 text-sm text-zinc-500 hover:border-[#DCFF0C]/50 hover:text-zinc-700 hover:bg-zinc-50/80 transition-all"
                      >
                        <Upload size={16} />
                        Foto hochladen (JPG, PNG)
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
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

              {/* Preview + Export */}
              <div className="space-y-6">
                {/* Preview */}
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
                  <div className="p-6 overflow-x-auto">
                    <div style={{ minWidth: 600 }}>
                      <SignaturePreview data={signatureData} qrCodeDataUrl={qrCodeDataUrl} />
                    </div>
                  </div>
                </div>

                {/* Export */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-700 flex items-center gap-3">
                    <div className="w-2 h-6 rounded-full bg-[#DCFF0C]" />
                    <h2 className="font-semibold text-white">Export für Outlook</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      Kopiere den HTML-Code und füge ihn direkt in Outlook als Signatur ein.
                      Der Code ist vollständig Outlook-kompatibel (Windows &amp; Mac).
                    </p>
                    <button
                      onClick={handleCopyHTML}
                      className="w-full flex items-center justify-center gap-2 bg-[#DCFF0C] text-[#1a1a1a] font-semibold py-3 px-6 rounded-xl text-sm hover:bg-[#c9eb0b] active:scale-[0.98] transition-all"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Check size={16} />
                            HTML-Code kopiert!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Copy size={16} />
                            HTML-Code kopieren
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <p className="text-zinc-600 text-xs text-center">
                      Danach:{' '}
                      <Link href="/signaturen/anleitung" className="text-[#DCFF0C] hover:underline">
                        Anleitung lesen &rarr;
                      </Link>
                    </p>
                  </div>
                </div>
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
      {/* Windows */}
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
            { step: 4, title: 'Neue Signatur erstellen', desc: 'Klicke auf „Neu", vergib einen Namen (z. B. „Reifen Gerlach") und bestätige mit OK.' },
            { step: 5, title: 'HTML-Code einfügen', desc: 'Klicke mit der rechten Maustaste in das Signatur-Textfeld und wähle „Quellcode anzeigen" – ODER wechsle unten rechts zu „HTML". Füge nun den kopierten HTML-Code mit Strg+V ein.' },
            { step: 6, title: 'Speichern', desc: 'Klicke auf OK und schließe alle Dialogfelder. Die Signatur steht ab sofort zur Verfügung.' },
          ].map(({ step, title, desc }) => (
            <li key={step} className="flex gap-5 px-6 py-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DCFF0C] text-[#1a1a1a] flex items-center justify-center font-bold text-sm mt-0.5">
                {step}
              </span>
              <div>
                <p className="font-semibold text-zinc-800 text-sm">{title}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Mac */}
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
            { step: 4, title: 'Name vergeben', desc: 'Gib der Signatur einen Namen, z. B. „Meine Signatur".' },
            { step: 5, title: 'HTML-Code einfügen', desc: 'Klicke in das Bearbeitungsfeld der Signatur. Wähle in der Menüleiste Bearbeiten → Als HTML einfügen und füge den kopierten Code ein.' },
            { step: 6, title: 'Speichern & schließen', desc: 'Klicke auf „Speichern" und schließe den Dialog. Wähle die neue Signatur als Standard, wenn gewünscht.' },
          ].map(({ step, title, desc }) => (
            <li key={step} className="flex gap-5 px-6 py-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#DCFF0C] text-[#1a1a1a] flex items-center justify-center font-bold text-sm mt-0.5">
                {step}
              </span>
              <div>
                <p className="font-semibold text-zinc-800 text-sm">{title}</p>
                <p className="text-zinc-500 text-sm mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Tips */}
      <div className="bg-[#DCFF0C]/10 border border-[#DCFF0C]/30 rounded-2xl p-6 space-y-3">
        <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
          <span className="text-[#DCFF0C] text-lg">&#9888;</span>
          Tipps &amp; Hinweise
        </h3>
        <ul className="space-y-2 text-sm text-zinc-600">
          <li className="flex gap-2">
            <span className="text-[#DCFF0C] font-bold mt-0.5">→</span>
            <span>
              <strong>HTML-Datei speichern:</strong> Speichere den HTML-Code als .htm-Datei (z. B. signatur.htm) auf deinem Desktop. So kannst du sie einfach per Drag &amp; Drop in das Signatur-Feld ziehen – besonders praktisch für Mac.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#DCFF0C] font-bold mt-0.5">→</span>
            <span>
              <strong>Bilder:</strong> Das Logo und das Profilfoto werden direkt als URL eingebunden. Stelle sicher, dass du eine aktive Internetverbindung hast, damit die Bilder angezeigt werden.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#DCFF0C] font-bold mt-0.5">→</span>
            <span>
              <strong>Outlook 365 (neu):</strong> In der neuesten Version von Outlook 365 (New Outlook) findest du die Signaturen unter Einstellungen → E-Mail → Verfassen und Antworten → E-Mail-Signatur.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#DCFF0C] font-bold mt-0.5">→</span>
            <span>
              <strong>Probleme?</strong> Wende dich an den IT-Support oder schreibe an{' '}
              <a href="mailto:it@raederlogistik.de" className="text-zinc-800 font-medium underline">
                it@raederlogistik.de
              </a>
              .
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
