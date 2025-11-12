interface FilterChipProps {
  label: string
  onRemove: () => void
  color?: 'cyan' | 'magenta' | 'purple' | 'green'
}

export default function FilterChip({ label, onRemove, color = 'cyan' }: FilterChipProps) {
  const colorClasses = {
    cyan: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-400',
    magenta: 'border-magenta-400/40 bg-magenta-500/10 text-magenta-400',
    purple: 'border-purple-400/40 bg-purple-500/10 text-purple-400',
    green: 'border-green-400/40 bg-green-500/10 text-green-400',
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorClasses[color]} font-medium text-sm transition-all hover:scale-105 group`}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="hover:bg-white/10 rounded-full p-0.5 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
