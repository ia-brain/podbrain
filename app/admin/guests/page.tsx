'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import SearchBar from '@/components/SearchBar'
import FilterPanel, { FilterSection, FilterOption } from '@/components/FilterPanel'
import FilterChip from '@/components/FilterChip'

type Guest = {
  id: string
  name: string
  email: string | null
  phone: string | null
  bio: string | null
  topics_of_interest: string[] | null
  communication_style: string | null
  created_at: string
  episode_guests?: Array<{
    episode_id: string
  }>
}

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedEpisodeRanges, setSelectedEpisodeRanges] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  // Get all unique topics and styles from guests
  const allTopics = useMemo(() => {
    const topics = new Set<string>()
    guests.forEach(guest => {
      guest.topics_of_interest?.forEach(topic => topics.add(topic))
    })
    return Array.from(topics).sort()
  }, [guests])

  const allStyles = useMemo(() => {
    const styles = new Set<string>()
    guests.forEach(guest => {
      if (guest.communication_style) styles.add(guest.communication_style)
    })
    return Array.from(styles).sort()
  }, [guests])

  useEffect(() => {
    fetchGuests()
  }, [])

  async function fetchGuests() {
    const { data, error } = await supabase
      .from('guests')
      .select(`
        *,
        episode_guests (
          episode_id
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching guests:', error)
    } else {
      setGuests(data || [])
    }
    setLoading(false)
  }

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = guest.name.toLowerCase().includes(query)
        const matchesBio = guest.bio?.toLowerCase().includes(query)
        const matchesEmail = guest.email?.toLowerCase().includes(query)
        const matchesStyle = guest.communication_style?.toLowerCase().includes(query)
        const topics = guest.topics_of_interest?.map(t => t.toLowerCase()) || []
        const matchesTopics = topics.some(topic => topic.includes(query))

        if (!matchesName && !matchesBio && !matchesEmail && !matchesStyle && !matchesTopics) {
          return false
        }
      }

      // Episode count filter
      if (selectedEpisodeRanges.length > 0) {
        const episodeCount = guest.episode_guests?.length || 0
        const matchesRange = selectedEpisodeRanges.some(range => {
          if (range === '0') return episodeCount === 0
          if (range === '1-5') return episodeCount >= 1 && episodeCount <= 5
          if (range === '6-10') return episodeCount >= 6 && episodeCount <= 10
          if (range === '10+') return episodeCount > 10
          return false
        })
        if (!matchesRange) return false
      }

      // Communication style filter
      if (selectedStyles.length > 0) {
        if (!guest.communication_style || !selectedStyles.includes(guest.communication_style)) {
          return false
        }
      }

      // Topics filter
      if (selectedTopics.length > 0) {
        const guestTopics = guest.topics_of_interest || []
        const hasSelectedTopic = selectedTopics.some(topic => guestTopics.includes(topic))
        if (!hasSelectedTopic) return false
      }

      return true
    })
  }, [guests, searchQuery, selectedEpisodeRanges, selectedStyles, selectedTopics])

  const activeFilterCount = selectedEpisodeRanges.length + selectedStyles.length + selectedTopics.length

  async function deleteGuest(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) return

    const { error } = await supabase.from('guests').delete().eq('id', id)

    if (error) {
      alert('Erro ao deletar convidado: ' + error.message)
    } else {
      setGuests(guests.filter(g => g.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="inline-block w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin glow-cyan"></div>
          <p className="mt-6 text-cyan-400 font-orbitron font-bold text-xl">LOADING GUESTS</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen -m-8 p-8">
      <AnimatedBackground />
      <div className="fixed inset-0 grid-overlay opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-magenta-500 glow-cyan"></div>
              <div>
                <h1 className="text-4xl font-orbitron font-bold text-gradient-neon">CONVIDADOS</h1>
                <p className="text-gray-400 mt-1">
                  <span className="text-cyan-400 font-orbitron font-bold">{filteredGuests.length}</span> resultados
                  {searchQuery && <span className="text-gray-500"> para "{searchQuery}"</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-6 py-3 rounded-xl font-orbitron font-bold transition-all flex items-center gap-2 relative ${
                  isFilterOpen || activeFilterCount > 0
                    ? 'neon-border bg-cyan-500/10 text-cyan-400'
                    : 'border border-cyan-400/30 text-gray-400 hover:border-cyan-400 hover:text-cyan-400'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                FILTROS
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-cyan-400 text-black rounded-full text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <Link
                href="/admin/guests/new"
                className="px-6 py-3 bg-gradient-neon text-black rounded-xl font-orbitron font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
              >
                + NOVO
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            placeholder="Buscar por nome, bio, email, tópico ou estilo de comunicação..."
            onSearch={setSearchQuery}
            className="mb-6"
          />

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400 font-medium">Filtros ativos:</span>
              {selectedEpisodeRanges.map(range => (
                <FilterChip
                  key={range}
                  label={`🎙️ ${range} episódios`}
                  onRemove={() => setSelectedEpisodeRanges(selectedEpisodeRanges.filter(r => r !== range))}
                  color="cyan"
                />
              ))}
              {selectedStyles.map(style => (
                <FilterChip
                  key={style}
                  label={`💬 ${style}`}
                  onRemove={() => setSelectedStyles(selectedStyles.filter(s => s !== style))}
                  color="magenta"
                />
              ))}
              {selectedTopics.map(topic => (
                <FilterChip
                  key={topic}
                  label={`🏷️ ${topic}`}
                  onRemove={() => setSelectedTopics(selectedTopics.filter(t => t !== topic))}
                  color="purple"
                />
              ))}
              <button
                onClick={() => {
                  setSelectedEpisodeRanges([])
                  setSelectedStyles([])
                  setSelectedTopics([])
                }}
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors underline"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>

        {/* Guests Grid */}
        {filteredGuests.length === 0 ? (
          <div className="holographic-card rounded-2xl p-16 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-3">Nenhum resultado encontrado</h3>
            <p className="text-gray-400 mb-6">Tente ajustar seus filtros ou termo de busca</p>
            {(searchQuery || activeFilterCount > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedEpisodeRanges([])
                  setSelectedStyles([])
                  setSelectedTopics([])
                }}
                className="px-6 py-3 neon-border rounded-xl text-cyan-400 font-orbitron font-bold hover:bg-cyan-500/10 transition-all"
              >
                LIMPAR FILTROS
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuests.map((guest) => {
              const episodeCount = guest.episode_guests?.length || 0

              return (
                <div
                  key={guest.id}
                  className="holographic-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all"
                >
                  {/* Header with gradient */}
                  <div className="relative h-24 bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-neon flex items-center justify-center text-3xl shadow-lg">
                        👤
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {guest.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Email */}
                    {guest.email && (
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{guest.email}</span>
                      </div>
                    )}

                    {/* Bio */}
                    {guest.bio && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-3">{guest.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-lg">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="text-cyan-400 font-orbitron text-sm font-bold">
                          {episodeCount}
                        </span>
                      </div>

                      {guest.communication_style && (
                        <div className="px-3 py-1.5 bg-magenta-500/20 border border-magenta-400/30 rounded-lg">
                          <span className="text-magenta-400 text-xs font-medium">
                            💬 {guest.communication_style}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Topics */}
                    {guest.topics_of_interest && guest.topics_of_interest.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {guest.topics_of_interest.slice(0, 3).map((topic, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!selectedTopics.includes(topic)) {
                                  setSelectedTopics([...selectedTopics, topic])
                                }
                              }}
                              className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-400 text-xs rounded font-medium hover:bg-purple-500/30 transition-all cursor-pointer"
                            >
                              🏷️ {topic}
                            </button>
                          ))}
                          {guest.topics_of_interest.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 border border-gray-400/30 text-gray-400 text-xs rounded">
                              +{guest.topics_of_interest.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-cyan-400/20">
                      <Link
                        href={`/admin/guests/${guest.id}/edit`}
                        className="flex-1 text-center py-2 neon-border rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-orbitron font-bold"
                      >
                        EDITAR
                      </Link>
                      <button
                        onClick={() => deleteGuest(guest.id, guest.name)}
                        className="flex-1 py-2 border border-red-400/40 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-sm font-orbitron font-bold"
                      >
                        DELETAR
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="FILTROS">
        <FilterSection title="Episódios">
          {['0', '1-5', '6-10', '10+'].map(range => (
            <FilterOption
              key={range}
              label={`${range} episódios`}
              checked={selectedEpisodeRanges.includes(range)}
              onChange={(checked) => {
                if (checked) {
                  setSelectedEpisodeRanges([...selectedEpisodeRanges, range])
                } else {
                  setSelectedEpisodeRanges(selectedEpisodeRanges.filter(r => r !== range))
                }
              }}
            />
          ))}
        </FilterSection>

        {allStyles.length > 0 && (
          <FilterSection title="Estilo de Comunicação">
            {allStyles.map(style => (
              <FilterOption
                key={style}
                label={style}
                checked={selectedStyles.includes(style)}
                onChange={(checked) => {
                  if (checked) {
                    setSelectedStyles([...selectedStyles, style])
                  } else {
                    setSelectedStyles(selectedStyles.filter(s => s !== style))
                  }
                }}
              />
            ))}
          </FilterSection>
        )}

        {allTopics.length > 0 && (
          <FilterSection title="Tópicos">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {allTopics.map(topic => (
                <FilterOption
                  key={topic}
                  label={topic}
                  checked={selectedTopics.includes(topic)}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedTopics([...selectedTopics, topic])
                    } else {
                      setSelectedTopics(selectedTopics.filter(t => t !== topic))
                    }
                  }}
                />
              ))}
            </div>
          </FilterSection>
        )}
      </FilterPanel>
    </div>
  )
}
