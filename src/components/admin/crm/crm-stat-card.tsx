export function formatRupiah(value: string | number): string {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)
  return `Rp ${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)}`
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '-'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** Tanggal dalam bentuk yang diterima <input type="date">. */
export function toDateInputValue(value: string | Date | null | undefined): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function CrmStatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-body-muted">{label}</div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-body-muted">{hint}</div>}
    </div>
  )
}
