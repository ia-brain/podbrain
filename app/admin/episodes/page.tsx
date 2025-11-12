'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import SearchBar from '@/components/SearchBar'
import FilterPanel, { FilterSection, FilterOption } from '@/components/FilterPanel'
import FilterChip from '@/components/FilterChip'

type Episode = {
  id: string
  title: string
  description: string | null
  youtube_url: string | null
  published_at: string | null
  is_premium: boolean
  created_at: string
  episode_guests?: Array<{
    guests: { id: string; name: string } | null
  }>
  episode_sponsors?: Array<{
    sponsors: { id: string; name: string } | null
  }>
}

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [allGuests, setAllGuests] = useState<Array<{ id: string; name: string }>>([])
  const [allSponsors, setAllSponsors] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedGuests, setSelectedGuests] = useState<string[]>([])
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>([])
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    // Fetch episodes
    const { data: episodesData, error: episodesError } = await supabase
      .from('episodes')
      .select(`
        *,
        episode_guests (
          guests (
            id,
            name
          )
        ),
        episode_sponsors (
          sponsors (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false })

    // Fetch all guests for filter
    const { data: guestsData } = await supabase
      .from('guests')
      .select('id, name')
      .order('name')

    // Fetch all sponsors for filter
    const { data: sponsorsData } = await supabase
      .from('sponsors')
      .select('id, name')
      .order('name')

    if (episodesError) {
      console.error('Error fetching episodes:', episodesError)
    } else {
      setEpisodes(episodesData || [])
    }

    setAllGuests(guestsData || [])
    setAllSponsors(sponsorsData || [])
    setLoading(false)
  }

  // Filtered Episodes
  const filteredEpisodes = useMemo(() => {
    return episodes.filter(episode => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = episode.title.toLowerCase().includes(query)
        const matchesDescription = episode.description?.toLowerCase().includes(query)
        const guests = episode.episode_guests?.map(eg => eg.guests?.name.toLowerCase()).filter(Boolean) || []
        const matchesGuests = guests.some(name => name?.includes(query))
        const sponsors = episode.episode_sponsors?.map(es => es.sponsors?.name.toLowerCase()).filter(Boolean) || []
        const matchesSponsors = sponsors.some(name => name?.includes(query))

        if (!matchesTitle && !matchesDescription && !matchesGuests && !matchesSponsors) {
          return false
        }
      }

      // Guest filter
      if (selectedGuests.length > 0) {
        const episodeGuestIds = episode.episode_guests?.map(eg => eg.guests?.id).filter(Boolean) || []
        const hasSelectedGuest = selectedGuests.some(guestId => episodeGuestIds.includes(guestId))
        if (!hasSelectedGuest) return false
      }

      // Sponsor filter
      if (selectedSponsors.length > 0) {
        const episodeSponsorIds = episode.episode_sponsors?.map(es => es.sponsors?.id).filter(Boolean) || []
        const hasSelectedSponsor = selectedSponsors.some(sponsorId => episodeSponsorIds.includes(sponsorId))
        if (!hasSelectedSponsor) return false
      }

      // Premium filter
      if (showPremiumOnly && !episode.is_premium) return false
      if (showFreeOnly && episode.is_premium) return false

      return true
    })
  }, [episodes, searchQuery, selectedGuests, selectedSponsors, showPremiumOnly, showFreeOnly])

  const activeFilterCount = selectedGuests.length + selectedSponsors.length +
    (showPremiumOnly ? 1 : 0) + (showFreeOnly ? 1 : 0)

  async function deleteEpisode(id: string, title: string) {
    if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) return

    const { error } = await supabase.from('episodes').delete().eq('id', id)

    if (error) {
      alert('Erro ao deletar episódio: ' + error.message)
    } else {
      setEpisodes(episodes.filter(ep => ep.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="inline-block w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin glow-cyan"></div>
          <p className="mt-6 text-cyan-400 font-orbitron font-bold text-xl">LOADING EPISODES</p>
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
                <h1 className="text-4xl font-orbitron font-bold text-gradient-neon">EPISÓDIOS</h1>
                <p className="text-gray-400 mt-1">
                  <span className="text-cyan-400 font-orbitron font-bold">{filteredEpisodes.length}</span> resultados
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
                href="/admin/episodes/new"
                className="px-6 py-3 bg-gradient-neon text-black rounded-xl font-orbitron font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
              >
                + NOVO
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            placeholder="Buscar por título, descrição, convidado ou patrocinador..."
            onSearch={setSearchQuery}
            className="mb-6"
          />

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400 font-medium">Filtros ativos:</span>
              {selectedGuests.map(guestId => {
                const guest = allGuests.find(g => g.id === guestId)
                return guest ? (
                  <FilterChip
                    key={guestId}
                    label={`👤 ${guest.name}`}
                    onRemove={() => setSelectedGuests(selectedGuests.filter(id => id !== guestId))}
                    color="purple"
                  />
                ) : null
              })}
              {selectedSponsors.map(sponsorId => {
                const sponsor = allSponsors.find(s => s.id === sponsorId)
                return sponsor ? (
                  <FilterChip
                    key={sponsorId}
                    label={`💼 ${sponsor.name}`}
                    onRemove={() => setSelectedSponsors(selectedSponsors.filter(id => id !== sponsorId))}
                    color="green"
                  />
                ) : null
              })}
              {showPremiumOnly && (
                <FilterChip
                  label="⭐ Premium"
                  onRemove={() => setShowPremiumOnly(false)}
                  color="cyan"
                />
              )}
              {showFreeOnly && (
                <FilterChip
                  label="🆓 Grátis"
                  onRemove={() => setShowFreeOnly(false)}
                  color="cyan"
                />
              )}
              <button
                onClick={() => {
                  setSelectedGuests([])
                  setSelectedSponsors([])
                  setShowPremiumOnly(false)
                  setShowFreeOnly(false)
                }}
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors underline"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>

        {/* Episodes Grid */}
        {filteredEpisodes.length === 0 ? (
          <div className="holographic-card rounded-2xl p-16 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-3">Nenhum resultado encontrado</h3>
            <p className="text-gray-400 mb-6">Tente ajustar seus filtros ou termo de busca</p>
            {(searchQuery || activeFilterCount > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedGuests([])
                  setSelectedSponsors([])
                  setShowPremiumOnly(false)
                  setShowFreeOnly(false)
                }}
                className="px-6 py-3 neon-border rounded-xl text-cyan-400 font-orbitron font-bold hover:bg-cyan-500/10 transition-all"
              >
                LIMPAR FILTROS
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEpisodes.map((episode) => {
              const guests = episode.episode_guests?.map(eg => eg.guests).filter(Boolean) || []
              const sponsors = episode.episode_sponsors?.map(es => es.sponsors).filter(Boolean) || []

              return (
                <div
                  key={episode.id}
                  className="holographic-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all"
                >
                  {/* Thumbnail */}
                  {episode.youtube_url && (
                    <Link href={`/admin/episodes/${episode.id}/edit`}>
                      <div className="aspect-video bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 relative overflow-hidden cursor-pointer">
                        <img
                          src={`https://img.youtube.com/vi/${extractYouTubeId(episode.youtube_url)}/maxresdefault.jpg`}
                          alt={episode.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        {episode.is_premium && (
                          <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold">
                            ⭐ PREMIUM
                          </div>
                        )}
                      </div>
                    </Link>
                  )}

                  <div className="p-6">
                    <Link href={`/admin/episodes/${episode.id}/edit`}>
                      <h3 className="text-xl font-bold text-white mb-3 hover:text-cyan-400 transition-colors cursor-pointer line-clamp-2 group-hover:text-cyan-400">
                        {episode.title}
                      </h3>
                    </Link>

                    {episode.description && (
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{episode.description}</p>
                    )}

                    {/* Guests */}
                    {guests.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-2">
                          {guests.map((guest: any) => (
                            <span key={guest.id} className="px-2 py-1 bg-purple-500/20 border border-purple-400/30 text-purple-400 text-xs rounded font-medium">
                              👤 {guest.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sponsors */}
                    {sponsors.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {sponsors.map((sponsor: any) => (
                            <span key={sponsor.id} className="px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-400 text-xs rounded font-medium">
                              💼 {sponsor.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-cyan-400/20">
                      <Link
                        href={`/admin/episodes/${episode.id}/edit`}
                        className="flex-1 text-center py-2 neon-border rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-orbitron font-bold"
                      >
                        EDITAR
                      </Link>
                      <button
                        onClick={() => deleteEpisode(episode.id, episode.title)}
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
        <FilterSection title="Status">
          <FilterOption
            label="Premium"
            checked={showPremiumOnly}
            onChange={setShowPremiumOnly}
          />
          <FilterOption
            label="Grátis"
            checked={showFreeOnly}
            onChange={setShowFreeOnly}
          />
        </FilterSection>

        <FilterSection title="Convidados">
          {allGuests.map(guest => (
            <FilterOption
              key={guest.id}
              label={guest.name}
              checked={selectedGuests.includes(guest.id)}
              onChange={(checked) => {
                if (checked) {
                  setSelectedGuests([...selectedGuests, guest.id])
                } else {
                  setSelectedGuests(selectedGuests.filter(id => id !== guest.id))
                }
              }}
            />
          ))}
        </FilterSection>

        <FilterSection title="Patrocinadores">
          {allSponsors.map(sponsor => (
            <FilterOption
              key={sponsor.id}
              label={sponsor.name}
              checked={selectedSponsors.includes(sponsor.id)}
              onChange={(checked) => {
                if (checked) {
                  setSelectedSponsors([...selectedSponsors, sponsor.id])
                } else {
                  setSelectedSponsors(selectedSponsors.filter(id => id !== sponsor.id))
                }
              }}
            />
          ))}
        </FilterSection>
      </FilterPanel>
    </div>
  )
}

function extractYouTubeId(url: string): string {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}
