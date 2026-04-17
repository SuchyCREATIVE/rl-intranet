import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signatur-Anleitung – Räderlogistik Intranet',
  description: 'Schritt-für-Schritt-Anleitung: E-Mail-Signatur in Outlook Windows und Outlook Mac einrichten.',
}

export default function AnleitungPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-[#1c1c1c] border-b-4 border-[#DCFF0C]">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link
            href="/signaturen"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-[#DCFF0C] text-sm transition-colors"
          >
            <ArrowLeft size={15} />
            Zurück zum Generator
          </Link>
          <div className="w-px h-5 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[#DCFF0C]" />
            <h1 className="text-white text-lg font-bold">Signatur in Outlook einrichten</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Intro */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
          <h2 className="text-zinc-800 font-semibold text-lg mb-2">So geht&apos;s</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Du hast im Signatur-Generator auf{' '}
            <strong className="text-zinc-700">„HTML-Code kopieren"</strong>{' '}
            geklickt und den Code in die Zwischenablage kopiert. Jetzt musst du ihn nur noch in
            Outlook als Signatur hinterlegen. Wähle unten dein Betriebssystem.
          </p>
        </div>

        {/* Windows */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#DCFF0C]">
                <path d="M3 5.557L10.56 4.5v7.245H3V5.557zM3 18.443L10.56 19.5V12.3H3v6.143zM11.44 19.64L21 21V12.3h-9.56v7.34zM11.44 4.36V11.745H21V3L11.44 4.36z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-800">Outlook für Windows</h2>
            <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              2016 · 2019 · 365
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <ol className="divide-y divide-zinc-100">
              {[
                {
                  step: 1,
                  title: 'Datei → Optionen',
                  desc: 'Öffne Outlook. Klicke oben links auf „Datei" und dann auf „Optionen".',
                  hint: 'Das Optionen-Fenster öffnet sich.',
                },
                {
                  step: 2,
                  title: 'E-Mail auswählen',
                  desc: 'Klicke in der linken Navigation des Optionen-Fensters auf „E-Mail".',
                  hint: null,
                },
                {
                  step: 3,
                  title: 'Signaturen öffnen',
                  desc: 'Klicke im Abschnitt „Nachrichten verfassen" auf die Schaltfläche „Signaturen…".',
                  hint: 'Der Signatur-Editor öffnet sich in einem neuen Fenster.',
                },
                {
                  step: 4,
                  title: 'Neue Signatur anlegen',
                  desc: 'Klicke auf „Neu". Gib der Signatur einen Namen (z. B. „Räderlogistik" oder deinen Namen) und bestätige mit OK.',
                  hint: null,
                },
                {
                  step: 5,
                  title: 'HTML-Code einfügen',
                  desc: 'Klicke mit der rechten Maustaste in das große Textfeld (das Bearbeitungsfeld der Signatur). Wähle im Kontextmenü „Quelltext bearbeiten" oder wechsle unten rechts im Signatur-Fenster zu „HTML". Füge den kopierten HTML-Code mit Strg+V ein.',
                  hint: 'Tipp: Falls kein Rechtsklick-Menü erscheint, klicke einmal in das Textfeld, drücke dann Strg+A um alles zu markieren, und danach Strg+V zum Einfügen.',
                },
                {
                  step: 6,
                  title: 'Signatur als Standard festlegen',
                  desc: 'Wähle rechts oben unter „Neue Nachrichten" und/oder „Antworten/Weiterleitungen" deine neue Signatur aus dem Dropdown-Menü aus.',
                  hint: null,
                },
                {
                  step: 7,
                  title: 'Speichern & schließen',
                  desc: 'Klicke auf OK und schließe alle geöffneten Dialogfelder. Die Signatur wird ab sofort automatisch in neue E-Mails eingefügt.',
                  hint: null,
                },
              ].map(({ step, title, desc, hint }) => (
                <li key={step} className="flex gap-5 px-6 py-5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#DCFF0C] text-[#1c1c1c] flex items-center justify-center font-bold text-sm mt-0.5 shadow-sm">
                    {step}
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-zinc-800">{title}</p>
                    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                    {hint && (
                      <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 mt-2">
                        {hint}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Mac */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#DCFF0C]">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-800">Outlook für Mac</h2>
            <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              2016 · 2019 · 365
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <ol className="divide-y divide-zinc-100">
              {[
                {
                  step: 1,
                  title: 'Einstellungen öffnen',
                  desc: 'Klicke in der macOS-Menüleiste auf „Outlook" → „Einstellungen" (oder drücke ⌘ + Komma).',
                  hint: null,
                },
                {
                  step: 2,
                  title: 'Signaturen aufrufen',
                  desc: 'Klicke im Einstellungen-Fenster unter dem Abschnitt „E-Mail" auf „Signaturen".',
                  hint: null,
                },
                {
                  step: 3,
                  title: 'Neue Signatur erstellen',
                  desc: 'Klicke unten links auf das „+" Symbol, um eine neue Signatur zu erstellen.',
                  hint: null,
                },
                {
                  step: 4,
                  title: 'Namen vergeben',
                  desc: 'Doppelklicke auf „Unbenannte Signatur" und vergib einen aussagekräftigen Namen.',
                  hint: null,
                },
                {
                  step: 5,
                  title: 'HTML-Code einfügen',
                  desc: 'Klicke in das Bearbeitungsfeld rechts. Wähle in der macOS-Menüleiste „Bearbeiten" → „Als HTML einfügen". Füge den kopierten HTML-Code ein.',
                  hint: 'Wichtig: Benutze „Als HTML einfügen" und nicht das normale Einfügen (⌘+V), sonst wird der HTML-Code als reiner Text dargestellt.',
                },
                {
                  step: 6,
                  title: 'Standardsignatur festlegen',
                  desc: 'Schließe das Signaturen-Fenster. Gehe zu Einstellungen → Signaturen und wähle rechts unter „Standard-Signatur" dein Konto und die neue Signatur aus.',
                  hint: null,
                },
                {
                  step: 7,
                  title: 'Fertig!',
                  desc: 'Öffne eine neue E-Mail – deine Signatur sollte automatisch erscheinen.',
                  hint: null,
                },
              ].map(({ step, title, desc, hint }) => (
                <li key={step} className="flex gap-5 px-6 py-5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#DCFF0C] text-[#1c1c1c] flex items-center justify-center font-bold text-sm mt-0.5 shadow-sm">
                    {step}
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-zinc-800">{title}</p>
                    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                    {hint && (
                      <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 mt-2">
                        {hint}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Outlook 365 New */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-600">
                <path d="M3 5.557L10.56 4.5v7.245H3V5.557zM3 18.443L10.56 19.5V12.3H3v6.143zM11.44 19.64L21 21V12.3h-9.56v7.34zM11.44 4.36V11.745H21V3L11.44 4.36z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-zinc-800">Neues Outlook 365</h2>
            <span className="text-xs text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
              Web &amp; New Outlook
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <ol className="divide-y divide-zinc-100">
              {[
                {
                  step: 1,
                  title: 'Einstellungen öffnen',
                  desc: 'Klicke oben rechts auf das Zahnrad-Symbol (⚙) → „Alle Outlook-Einstellungen anzeigen".',
                  hint: null,
                },
                {
                  step: 2,
                  title: 'Verfassen und Antworten',
                  desc: 'Gehe zu E-Mail → Verfassen und Antworten.',
                  hint: null,
                },
                {
                  step: 3,
                  title: 'E-Mail-Signatur',
                  desc: 'Scrolle nach unten zum Abschnitt „E-Mail-Signatur". Klicke auf „Neue Signatur" oder bearbeite eine bestehende.',
                  hint: null,
                },
                {
                  step: 4,
                  title: 'HTML einfügen',
                  desc: 'Klicke im Signatur-Editor auf die drei Punkte (···) oder suche nach einem „</>"-Symbol um in den HTML-Modus zu wechseln. Füge den Code ein.',
                  hint: 'Im Web-Outlook (outlook.com / office.com) kannst du den HTML-Code direkt mit Strg+Shift+X (Windows) oder ⌥+F10 aufrufen.',
                },
                {
                  step: 5,
                  title: 'Speichern',
                  desc: 'Klicke auf „Speichern" und weise die Signatur als Standard für neue Nachrichten zu.',
                  hint: null,
                },
              ].map(({ step, title, desc, hint }) => (
                <li key={step} className="flex gap-5 px-6 py-5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center font-bold text-sm mt-0.5 shadow-sm">
                    {step}
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-zinc-800">{title}</p>
                    <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
                    {hint && (
                      <p className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2 mt-2">
                        {hint}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tips */}
        <div className="bg-[#DCFF0C]/10 border border-[#DCFF0C]/30 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-zinc-800 text-lg">Tipps &amp; Hinweise</h3>
          <ul className="space-y-3 text-sm text-zinc-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#DCFF0C] text-[#1c1c1c] flex items-center justify-center font-bold text-xs mt-0.5">!</span>
              <div>
                <strong className="text-zinc-700">HTML-Datei für einfachere Installation:</strong>{' '}
                Speichere den HTML-Code in einer Textdatei mit der Endung <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">.htm</code> (z. B. <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">signatur.htm</code>). Auf dem Mac kannst du diese Datei direkt in das Signatur-Textfeld ziehen.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#DCFF0C] text-[#1c1c1c] flex items-center justify-center font-bold text-xs mt-0.5">!</span>
              <div>
                <strong className="text-zinc-700">Bilder werden nicht angezeigt?</strong>{' '}
                Stelle sicher, dass du mit dem Internet verbunden bist. Outlook blockiert manchmal externe Bilder – klicke in diesem Fall auf den Banner „Bilder herunterladen" beim Öffnen einer E-Mail mit deiner Signatur.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#DCFF0C] text-[#1c1c1c] flex items-center justify-center font-bold text-xs mt-0.5">!</span>
              <div>
                <strong className="text-zinc-700">Signatur sieht falsch aus?</strong>{' '}
                Überprüfe, ob du den HTML-Code mit „Als HTML einfügen" (Mac) oder im HTML-Modus (Windows) eingefügt hast. Normales Einfügen zeigt den Quellcode als Text an.
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#DCFF0C] text-[#1c1c1c] flex items-center justify-center font-bold text-xs mt-0.5">!</span>
              <div>
                <strong className="text-zinc-700">Support:</strong>{' '}
                Bei Fragen oder Problemen wende dich bitte an{' '}
                <a href="mailto:it@raederlogistik.de" className="text-zinc-800 font-medium underline hover:text-[#1c1c1c]">
                  it@raederlogistik.de
                </a>
                .
              </div>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center pb-4">
          <Link
            href="/signaturen"
            className="inline-flex items-center gap-2 bg-[#1c1c1c] text-[#DCFF0C] font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Zurück zum Signatur-Generator
          </Link>
        </div>
      </div>
    </div>
  )
}
