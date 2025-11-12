'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ViewSwitcher from '@/components/ViewSwitcher'

type ViewMode = 'list' | 'grid' | 'hero'

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

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

  async function deleteSponsor(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) {
      return
    }

    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao deletar patrocinador: ' + error.message)
    } else {
      alert('Patrocinador deletado com sucesso!')
      fetchSponsors()
    }
  }

  function getRandomGradient() {
    const gradients = [
      'from-purple-600 via-pink-600 to-blue-600',
      'from-blue-600 via-purple-600 to-pink-600',
      'from-pink-600 via-purple-600 to-blue-600',
      'from-purple-500 via-pink-500 to-orange-500',
      'from-blue-500 via-purple-500 to-pink-500',
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  }

  function getContractType() {
    const types = ['Anual', 'Mensal', 'Por Episódio', 'Semestral']
    return types[Math.floor(Math.random() * types.length)]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando patrocinadores...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patrocinadores</h1>
          <p className="text-gray-600 mt-1">{sponsors.length} patrocinadores totais</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
          <Link
            href="/admin/sponsors/new"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-medium"
          >
            + Novo Patrocinador
          </Link>
        </div>
      </div>

      {sponsors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum patrocinador ainda</h2>
          <p className="text-gray-600 mb-6">Adicione seu primeiro patrocinador do podcast</p>
          <Link
            href="/admin/sponsors/new"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
          >
            Adicionar Primeiro Patrocinador
          </Link>
        </div>
      ) : (
        <>
          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Episódios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Geo-Targeting
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sponsors.map((sponsor) => {
                    const episodeCount = sponsor.episode_sponsors?.length || 0

                    return (
                      <tr key={sponsor.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">💼</div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {sponsor.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {sponsor.website ? (
                            <a
                              href={sponsor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-purple-600 hover:underline truncate max-w-xs block"
                            >
                              {sponsor.website}
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {sponsor.contact_email && (
                              <div className="text-gray-900 truncate max-w-xs">{sponsor.contact_email}</div>
                            )}
                            {sponsor.contact_phone && (
                              <div className="text-gray-500">{sponsor.contact_phone}</div>
                            )}
                            {!sponsor.contact_email && !sponsor.contact_phone && (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            {episodeCount} {episodeCount === 1 ? 'episódio' : 'episódios'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {sponsor.geo_targeting && sponsor.geo_targeting.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {sponsor.geo_targeting.slice(0, 2).map((region: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium"
                                >
                                  📍 {region}
                                </span>
                              ))}
                              {sponsor.geo_targeting.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{sponsor.geo_targeting.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/sponsors/${sponsor.id}/edit`}
                            className="text-purple-600 hover:text-purple-900 mr-4 font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Deletar
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sponsors.map((sponsor) => {
                const episodeCount = sponsor.episode_sponsors?.length || 0

                return (
                  <div
                    key={sponsor.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {sponsor.name}
                        </h3>
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline break-all"
                          >
                            {sponsor.website}
                          </a>
                        )}
                      </div>
                      <div className="text-3xl ml-2">💼</div>
                    </div>

                    {sponsor.contact_email && (
                      <p className="text-sm text-gray-600 mb-2 break-all">
                        📧 {sponsor.contact_email}
                      </p>
                    )}

                    {sponsor.contact_phone && (
                      <p className="text-sm text-gray-600 mb-4">
                        📞 {sponsor.contact_phone}
                      </p>
                    )}

                    {sponsor.geo_targeting && sponsor.geo_targeting.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">Targeting:</p>
                        <div className="flex flex-wrap gap-1">
                          {sponsor.geo_targeting.map((region: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium"
                            >
                              📍 {region}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        🎙️ {episodeCount} {episodeCount === 1 ? 'episódio' : 'episódios'}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Link
                        href={`/admin/sponsors/${sponsor.id}/edit`}
                        className="flex-1 text-center py-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition text-sm font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
                        className="flex-1 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-sm font-medium"
                      >
                        Deletar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* HERO VIEW */}
          {viewMode === 'hero' && (
            <div className="space-y-4">
              {sponsors.map((sponsor) => {
                const episodeCount = sponsor.episode_sponsors?.length || 0
                const contractType = getContractType()

                return (
                  <div
                    key={sponsor.id}
                    className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${getRandomGradient()}`}></div>

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition"></div>

                    {/* Content */}
                    <div className="relative h-full flex items-center px-8">
                      {/* Profile Image */}
                      <div className="flex-shrink-0 mr-6">
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-xl">
                          {sponsor.logo_url ? (
                            <img
                              src={sponsor.logo_url}
                              alt={sponsor.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-5xl">💼</span>
                          )}
                        </div>
                      </div>

                      {/* Sponsor Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full border border-white/30">
                            Patrocinador
                          </span>
                          <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-bold rounded-full">
                            {contractType.toUpperCase()}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:scale-105 transition">
                          {sponsor.name}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                          {/* Contract Type */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">
                              Contrato: {contractType}
                            </span>
                          </div>

                          {/* Episodes */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            <span className="text-sm font-medium">
                              {episodeCount} {episodeCount === 1 ? 'episódio' : 'episódios'}
                            </span>
                          </div>

                          {/* Website */}
                          {sponsor.website && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                              </svg>
                              <a
                                href={sponsor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium hover:underline truncate max-w-xs"
                              >
                                {sponsor.website.replace(/^https?:\/\/(www\.)?/, '')}
                              </a>
                            </div>
                          )}

                          {/* Geo-Targeting */}
                          {sponsor.geo_targeting && sponsor.geo_targeting.length > 0 && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">
                                {sponsor.geo_targeting.slice(0, 2).join(', ')}
                                {sponsor.geo_targeting.length > 2 && ` +${sponsor.geo_targeting.length - 2}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-3">
                        <Link
                          href={`/admin/sponsors/${sponsor.id}/edit`}
                          className="px-6 py-3 bg-white/90 hover:bg-white text-purple-600 rounded-lg font-bold transition backdrop-blur-sm shadow-lg"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
                          className="px-6 py-3 bg-red-500/90 hover:bg-red-500 text-white rounded-lg font-bold transition backdrop-blur-sm shadow-lg"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
