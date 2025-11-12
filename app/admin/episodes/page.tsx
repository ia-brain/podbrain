'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ViewSwitcher from '@/components/ViewSwitcher'

type ViewMode = 'list' | 'grid' | 'hero'

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  useEffect(() => {
    fetchEpisodes()
  }, [])

  async function fetchEpisodes() {
    // Fetch episodes with their guests and sponsors
    const { data: episodesData, error } = await supabase
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
          ),
          placement_type
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching episodes:', error)
    } else {
      setEpisodes(episodesData || [])
    }
    setLoading(false)
  }

  async function deleteEpisode(id: string, title: string) {
    if (!confirm(`Tem certeza que deseja deletar "${title}"?`)) {
      return
    }

    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao deletar episódio: ' + error.message)
    } else {
      alert('Episódio deletado com sucesso!')
      fetchEpisodes()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando episódios...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Episódios</h1>
          <p className="text-gray-600 mt-1">{episodes.length} episódios totais</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
          <Link
            href="/admin/episodes/new"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-medium"
          >
            + Novo Episódio
          </Link>
        </div>
      </div>

      {episodes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🎙️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum episódio ainda</h2>
          <p className="text-gray-600 mb-6">Comece criando seu primeiro episódio</p>
          <Link
            href="/admin/episodes/new"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
          >
            Criar Primeiro Episódio
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
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Convidados
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Patrocinadores
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Publicado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {episodes.map((episode) => {
                    const guests = episode.episode_guests?.map((eg: any) => eg.guests).filter(Boolean) || []
                    const sponsors = episode.episode_sponsors?.map((es: any) => es.sponsors).filter(Boolean) || []

                    return (
                      <tr key={episode.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {episode.title}
                              </div>
                              {episode.description && (
                                <div className="text-sm text-gray-500 truncate max-w-md">
                                  {episode.description.substring(0, 80)}...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {guests.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {guests.map((guest: any) => (
                                <span
                                  key={guest.id}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium"
                                >
                                  {guest.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sem convidados</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {sponsors.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {sponsors.map((sponsor: any) => (
                                <span
                                  key={sponsor.id}
                                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium"
                                >
                                  💼 {sponsor.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Sem patrocinadores</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {episode.published_at
                              ? new Date(episode.published_at).toLocaleDateString('pt-BR')
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {episode.is_premium ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Premium
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Grátis
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/episodes/${episode.id}/edit`}
                            className="text-purple-600 hover:text-purple-900 mr-4 font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => deleteEpisode(episode.id, episode.title)}
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
              {episodes.map((episode) => {
                const guests = episode.episode_guests?.map((eg: any) => eg.guests).filter(Boolean) || []
                const sponsors = episode.episode_sponsors?.map((es: any) => es.sponsors).filter(Boolean) || []

                return (
                  <div
                    key={episode.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border border-gray-100"
                  >
                    {episode.youtube_url && (
                      <Link href={`/admin/episodes/${episode.id}/edit`}>
                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 cursor-pointer hover:opacity-90 transition">
                          <img
                            src={`https://img.youtube.com/vi/${extractYouTubeId(episode.youtube_url)}/maxresdefault.jpg`}
                            alt={episode.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                    )}

                    <div className="p-5">
                      <Link href={`/admin/episodes/${episode.id}/edit`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-purple-600 transition cursor-pointer line-clamp-2">
                          {episode.title}
                        </h3>
                      </Link>

                      {guests.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Convidados:</p>
                          <div className="flex flex-wrap gap-1">
                            {guests.map((guest: any) => (
                              <span
                                key={guest.id}
                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium"
                              >
                                👤 {guest.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {sponsors.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 mb-1">Patrocinadores:</p>
                          <div className="flex flex-wrap gap-1">
                            {sponsors.map((sponsor: any) => (
                              <span
                                key={sponsor.id}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium"
                              >
                                💼 {sponsor.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          episode.is_premium
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {episode.is_premium ? '⭐ Premium' : '🆓 Grátis'}
                        </span>
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/episodes/${episode.id}/edit`}
                            className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => deleteEpisode(episode.id, episode.title)}
                            className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition font-medium"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* HERO VIEW */}
          {viewMode === 'hero' && (
            <div className="space-y-4">
              {episodes.map((episode, index) => {
                const guests = episode.episode_guests?.map((eg: any) => eg.guests).filter(Boolean) || []
                const sponsors = episode.episode_sponsors?.map((es: any) => es.sponsors).filter(Boolean) || []
                const randomViews = Math.floor(Math.random() * 500000) + 50000 // Mock views data

                return (
                  <div
                    key={episode.id}
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
                          {episode.youtube_url ? (
                            <img
                              src={`https://img.youtube.com/vi/${extractYouTubeId(episode.youtube_url)}/default.jpg`}
                              alt={episode.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl">🎙️</span>
                          )}
                        </div>
                      </div>

                      {/* Episode Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full border border-white/30">
                            Episódio #{index + 1}
                          </span>
                          {episode.is_premium && (
                            <span className="px-3 py-1 bg-yellow-500/90 text-white text-xs font-bold rounded-full">
                              ⭐ PREMIUM
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:scale-105 transition">
                          {episode.title}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                          {/* Guests */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span className="text-sm font-medium">
                              {guests.length > 0 ? guests.map((g: any) => g.name).join(', ') : 'Sem convidados'}
                            </span>
                          </div>

                          {/* Views */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">
                              {randomViews.toLocaleString('pt-BR')} visualizações
                            </span>
                          </div>

                          {/* Sponsors */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">
                              {sponsors.length > 0 ? `${sponsors.length} patrocinador${sponsors.length > 1 ? 'es' : ''}` : 'Sem patrocinadores'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-3">
                        <Link
                          href={`/admin/episodes/${episode.id}/edit`}
                          className="px-6 py-3 bg-white/90 hover:bg-white text-purple-600 rounded-lg font-bold transition backdrop-blur-sm shadow-lg"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => deleteEpisode(episode.id, episode.title)}
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

function extractYouTubeId(url: string): string {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}
