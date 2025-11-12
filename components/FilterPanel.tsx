'use client'

import { useState } from 'react'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function FilterPanel({ isOpen, onClose, children, title = "Filters" }: FilterPanelProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#13131a] border-l border-cyan-400/20 shadow-[0_0_50px_rgba(0,255,255,0.2)] z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-cyan-400/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-cyan-400 glow-cyan"></div>
                <h2 className="text-2xl font-orbitron font-bold text-white">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cyan-500/10 rounded-lg transition-all group neon-border"
              >
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-400">Refine your search results</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scanline">
            {children}
          </div>
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
      </div>
    </>
  )
}

// Filter Section Component
export function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-orbitron font-bold text-cyan-400 uppercase tracking-wider">{title}</h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  )
}

// Filter Option Component
export function FilterOption({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/5 cursor-pointer transition-all group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-5 h-5 rounded border-2 transition-all ${
          checked
            ? 'border-cyan-400 bg-cyan-500/20'
            : 'border-gray-600 bg-transparent'
        }`}>
          {checked && (
            <svg className="w-full h-full text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </label>
  )
}
