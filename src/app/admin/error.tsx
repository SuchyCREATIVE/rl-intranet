'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div style={{ padding: 32, fontFamily: 'monospace' }}>
      <h2 style={{ color: 'red' }}>Admin Fehler</h2>
      <p><strong>Message:</strong> {error.message}</p>
      <p><strong>Digest:</strong> {error.digest}</p>
      <pre style={{ background: '#f0f0f0', padding: 16, overflow: 'auto', fontSize: 12 }}>
        {error.stack}
      </pre>
      <button onClick={reset}>Neu laden</button>
    </div>
  )
}
