'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import SearchBar from '@/components/SearchBar'
import FilterPanel, { FilterSection, FilterOption } from '@/components/FilterPanel'
import FilterChip from '@/components/FilterChip'

type Sponsor = {
  id: string
  name: string
  website: string | null
  contact_email: string | null
  contact_phone: string | null
  logo_url: string | null
  geo_targeting: string[] | null
  created_at: string
  episode_sponsors?: Array<{
    episode_id: string
    placement_type: string
  }>
}

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedEpisodeRanges, setSelectedEpisodeRanges] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>([])

  // Get all unique regions and placement types
  const allRegions = useMemo(() => {
    const regions = new Set<string>()
    sponsors.forEach(sponsor => {
      sponsor.geo_targeting?.forEach(region => regions.add(region))
    })
    return Array.from(regions).sort()
  }, [sponsors])

  const allPlacements = useMemo(() => {
    const placements = new Set<string>()
    sponsors.forEach(sponsor => {
      sponsor.episode_sponsors?.forEach(ep => {
        if (ep.placement_type) placements.add(ep.placement_type)
      })
    })
    return Array.from(placements).sort()
  }, [sponsors])

  useEffect(() => {
    fetchSponsors()
  }, [])

  async function fetchSponsors() {
    const { data, error } = await supabase
      .from('sponsors')
      .select(`
        *,
        episode_sponsors (
          episode_id,
          placement_type
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sponsors:', error)
    } else {
      setSponsors(data || [])
    }
    setLoading(false)
  }

  // Filtered Sponsors
  const filteredSponsors = useMemo(() => {
    return sponsors.filter(sponsor => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = sponsor.name.toLowerCase().includes(query)
        const matchesWebsite = sponsor.website?.toLowerCase().includes(query)
        const matchesEmail = sponsor.contact_email?.toLowerCase().includes(query)
        const regions = sponsor.geo_targeting?.map(r => r.toLowerCase()) || []
        const matchesRegions = regions.some(region => region.includes(query))

        if (!matchesName && !matchesWebsite && !matchesEmail && !matchesRegions) {
          return false
        }
      }

      // Episode count filter
      if (selectedEpisodeRanges.length > 0) {
        const episodeCount = sponsor.episode_sponsors?.length || 0
        const matchesRange = selectedEpisodeRanges.some(range => {
          if (range === '0') return episodeCount === 0
          if (range === '1-5') return episodeCount >= 1 && episodeCount <= 5
          if (range === '6-10') return episodeCount >= 6 && episodeCount <= 10
          if (range === '10+') return episodeCount > 10
          return false
        })
        if (!matchesRange) return false
      }

      // Geo-targeting filter
      if (selectedRegions.length > 0) {
        const sponsorRegions = sponsor.geo_targeting || []
        const hasSelectedRegion = selectedRegions.some(region => sponsorRegions.includes(region))
        if (!hasSelectedRegion) return false
      }

      // Placement type filter
      if (selectedPlacements.length > 0) {
        const sponsorPlacements = sponsor.episode_sponsors?.map(ep => ep.placement_type).filter(Boolean) || []
        const hasSelectedPlacement = selectedPlacements.some(placement => sponsorPlacements.includes(placement))
        if (!hasSelectedPlacement) return false
      }

      return true
    })
  }, [sponsors, searchQuery, selectedEpisodeRanges, selectedRegions, selectedPlacements])

  const activeFilterCount = selectedEpisodeRanges.length + selectedRegions.length + selectedPlacements.length

  async function deleteSponsor(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) return

    const { error } = await supabase.from('sponsors').delete().eq('id', id)

    if (error) {
      alert('Erro ao deletar patrocinador: ' + error.message)
    } else {
      setSponsors(sponsors.filter(s => s.id !== id))
    }
  }

  const getPlacementLabel = (type: string) => {
    const labels: Record<string, string> = {
      'banner_top': 'Banner Topo',
      'banner_mid': 'Banner Meio',
      'banner_end': 'Banner Final',
      'video': 'Vídeo',
      'audio': 'Áudio',
      'pause_screen': 'Tela de Pausa'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen relative">
        <AnimatedBackground />
        <div className="text-center relative z-10">
          <div className="inline-block w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin glow-cyan"></div>
          <p className="mt-6 text-cyan-400 font-orbitron font-bold text-xl">LOADING SPONSORS</p>
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
                <h1 className="text-4xl font-orbitron font-bold text-gradient-neon">PATROCINADORES</h1>
                <p className="text-gray-400 mt-1">
                  <span className="text-cyan-400 font-orbitron font-bold">{filteredSponsors.length}</span> resultados
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
                href="/admin/sponsors/new"
                className="px-6 py-3 bg-gradient-neon text-black rounded-xl font-orbitron font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
              >
                + NOVO
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            placeholder="Buscar por nome, website, email ou região..."
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
              {selectedRegions.map(region => (
                <FilterChip
                  key={region}
                  label={`📍 ${region}`}
                  onRemove={() => setSelectedRegions(selectedRegions.filter(r => r !== region))}
                  color="green"
                />
              ))}
              {selectedPlacements.map(placement => (
                <FilterChip
                  key={placement}
                  label={`📺 ${getPlacementLabel(placement)}`}
                  onRemove={() => setSelectedPlacements(selectedPlacements.filter(p => p !== placement))}
                  color="magenta"
                />
              ))}
              <button
                onClick={() => {
                  setSelectedEpisodeRanges([])
                  setSelectedRegions([])
                  setSelectedPlacements([])
                }}
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors underline"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>

        {/* Sponsors Grid */}
        {filteredSponsors.length === 0 ? (
          <div className="holographic-card rounded-2xl p-16 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-3">Nenhum resultado encontrado</h3>
            <p className="text-gray-400 mb-6">Tente ajustar seus filtros ou termo de busca</p>
            {(searchQuery || activeFilterCount > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedEpisodeRanges([])
                  setSelectedRegions([])
                  setSelectedPlacements([])
                }}
                className="px-6 py-3 neon-border rounded-xl text-cyan-400 font-orbitron font-bold hover:bg-cyan-500/10 transition-all"
              >
                LIMPAR FILTROS
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSponsors.map((sponsor) => {
              const episodeCount = sponsor.episode_sponsors?.length || 0
              const placements = [...new Set(sponsor.episode_sponsors?.map(ep => ep.placement_type).filter(Boolean))]

              return (
                <div
                  key={sponsor.id}
                  className="holographic-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all"
                >
                  {/* Header with logo */}
                  <div className="relative h-32 bg-gradient-to-br from-green-500/20 to-cyan-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {sponsor.logo_url ? (
                        <div className="w-24 h-24 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 overflow-hidden shadow-lg">
                          <img
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-gradient-neon flex items-center justify-center text-4xl shadow-lg">
                          💼
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Name */}
                    <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-cyan-400 transition-colors">
                      {sponsor.name}
                    </h3>

                    {/* Website */}
                    {sponsor.website && (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors truncate max-w-full"
                        >
                          {sponsor.website.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {sponsor.contact_email && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate">{sponsor.contact_email}</span>
                        </div>
                      )}
                      {sponsor.contact_phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{sponsor.contact_phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-lg">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span className="text-cyan-400 font-orbitron text-sm font-bold">
                          {episodeCount}
                        </span>
                      </div>
                    </div>

                    {/* Geo-Targeting */}
                    {sponsor.geo_targeting && sponsor.geo_targeting.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 font-medium mb-2">Targeting:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {sponsor.geo_targeting.slice(0, 3).map((region, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (!selectedRegions.includes(region)) {
                                  setSelectedRegions([...selectedRegions, region])
                                }
                              }}
                              className="px-2 py-1 bg-green-500/20 border border-green-400/30 text-green-400 text-xs rounded font-medium hover:bg-green-500/30 transition-all cursor-pointer"
                            >
                              📍 {region}
                            </button>
                          ))}
                          {sponsor.geo_targeting.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 border border-gray-400/30 text-gray-400 text-xs rounded">
                              +{sponsor.geo_targeting.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Placement Types */}
                    {placements.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 font-medium mb-2">Placements:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {placements.slice(0, 3).map((placement, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-magenta-500/20 border border-magenta-400/30 text-magenta-400 text-xs rounded font-medium"
                            >
                              📺 {getPlacementLabel(placement)}
                            </span>
                          ))}
                          {placements.length > 3 && (
                            <span className="px-2 py-1 bg-gray-500/20 border border-gray-400/30 text-gray-400 text-xs rounded">
                              +{placements.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-cyan-400/20">
                      <Link
                        href={`/admin/sponsors/${sponsor.id}/edit`}
                        className="flex-1 text-center py-2 neon-border rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm font-orbitron font-bold"
                      >
                        EDITAR
                      </Link>
                      <button
                        onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
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

        {allRegions.length > 0 && (
          <FilterSection title="Geo-Targeting">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {allRegions.map(region => (
                <FilterOption
                  key={region}
                  label={region}
                  checked={selectedRegions.includes(region)}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedRegions([...selectedRegions, region])
                    } else {
                      setSelectedRegions(selectedRegions.filter(r => r !== region))
                    }
                  }}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {allPlacements.length > 0 && (
          <FilterSection title="Tipos de Placement">
            {allPlacements.map(placement => (
              <FilterOption
                key={placement}
                label={getPlacementLabel(placement)}
                checked={selectedPlacements.includes(placement)}
                onChange={(checked) => {
                  if (checked) {
                    setSelectedPlacements([...selectedPlacements, placement])
                  } else {
                    setSelectedPlacements(selectedPlacements.filter(p => p !== placement))
                  }
                }}
              />
            ))}
          </FilterSection>
        )}
      </FilterPanel>
    </div>
  )
}
