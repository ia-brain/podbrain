'use client'

import { useEffect, useState, useCallback } from 'react'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
  className?: string
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs, onSearch])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  // Keyboard shortcut: "/" to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        document.getElementById('main-search')?.focus()
      }
      if (e.key === 'Escape') {
        handleClear()
        document.getElementById('main-search')?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className={`relative transition-all duration-300 ${
        isFocused ? 'scale-105' : 'scale-100'
      }`}>
        {/* Search Icon */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
          <svg
            className={`w-6 h-6 transition-colors ${
              isFocused ? 'text-cyan-400' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          id="main-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full px-16 py-6 bg-[#1a1a24] text-white text-xl font-medium rounded-2xl transition-all duration-300 ${
            isFocused
              ? 'neon-border shadow-[0_0_30px_rgba(0,255,255,0.3)]'
              : 'border border-cyan-400/20'
          } focus:outline-none placeholder:text-gray-500`}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-cyan-500/10 rounded-lg transition-all group"
          >
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Glow effect when focused */}
        {isFocused && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-magenta-400/10 blur-xl -z-10 animate-pulse"></div>
        )}
      </div>

      {/* Keyboard Hint */}
      {!isFocused && !query && (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm text-gray-500">
          <span>Press</span>
          <kbd className="px-2 py-1 bg-[#13131a] border border-cyan-400/30 rounded text-cyan-400 font-orbitron text-xs">/</kbd>
          <span>to search</span>
        </div>
      )}
    </div>
  )
}
