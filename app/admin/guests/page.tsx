'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ViewSwitcher from '@/components/ViewSwitcher'

type ViewMode = 'list' | 'grid' | 'hero'

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

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

  async function deleteGuest(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) {
      return
    }

    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao deletar convidado: ' + error.message)
    } else {
      alert('Convidado deletado com sucesso!')
      fetchGuests()
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

  function getFirstAndLastName(fullName: string) {
    const parts = fullName.trim().split(' ')
    if (parts.length === 1) return { first: parts[0], last: '' }
    const first = parts[0]
    const last = parts[parts.length - 1]
    return { first, last }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando convidados...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Convidados</h1>
          <p className="text-gray-600 mt-1">{guests.length} convidados totais</p>
        </div>
        <div className="flex items-center gap-4">
          <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
          <Link
            href="/admin/guests/new"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition font-medium"
          >
            + Novo Convidado
          </Link>
        </div>
      </div>

      {guests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum convidado ainda</h2>
          <p className="text-gray-600 mb-6">Adicione seu primeiro convidado do podcast</p>
          <Link
            href="/admin/guests/new"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
          >
            Adicionar Primeiro Convidado
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
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tópicos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Episódios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Estilo
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guests.map((guest) => {
                    const episodeCount = guest.episode_guests?.length || 0

                    return (
                      <tr key={guest.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {guest.name}
                            </div>
                            {guest.bio && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {guest.bio.substring(0, 60)}...
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            {guest.email && (
                              <div className="text-gray-900">{guest.email}</div>
                            )}
                            {guest.phone && (
                              <div className="text-gray-500">{guest.phone}</div>
                            )}
                            {!guest.email && !guest.phone && (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {guest.topics_of_interest && guest.topics_of_interest.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {guest.topics_of_interest.slice(0, 2).map((topic: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium"
                                >
                                  {topic}
                                </span>
                              ))}
                              {guest.topics_of_interest.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{guest.topics_of_interest.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                            {episodeCount} {episodeCount === 1 ? 'episódio' : 'episódios'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {guest.communication_style || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/guests/${guest.id}/edit`}
                            className="text-purple-600 hover:text-purple-900 mr-4 font-medium"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => deleteGuest(guest.id, guest.name)}
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
              {guests.map((guest) => {
                const episodeCount = guest.episode_guests?.length || 0

                return (
                  <div
                    key={guest.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {guest.name}
                        </h3>
                        {guest.email && (
                          <p className="text-sm text-gray-600">{guest.email}</p>
                        )}
                      </div>
                      <div className="text-3xl">👤</div>
                    </div>

                    {guest.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {guest.bio}
                      </p>
                    )}

                    {guest.topics_of_interest && guest.topics_of_interest.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 mb-2">Tópicos:</p>
                        <div className="flex flex-wrap gap-1">
                          {guest.topics_of_interest.slice(0, 3).map((topic: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded font-medium"
                            >
                              {topic}
                            </span>
                          ))}
                          {guest.topics_of_interest.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              +{guest.topics_of_interest.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        🎙️ {episodeCount} {episodeCount === 1 ? 'episódio' : 'episódios'}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Link
                        href={`/admin/guests/${guest.id}/edit`}
                        className="flex-1 text-center py-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition text-sm font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => deleteGuest(guest.id, guest.name)}
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
              {guests.map((guest) => {
                const episodeCount = guest.episode_guests?.length || 0
                const { first, last } = getFirstAndLastName(guest.name)
                const topicsDisplay = guest.topics_of_interest?.slice(0, 3).join(', ') || 'Nenhum tópico'

                return (
                  <div
                    key={guest.id}
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
                          <span className="text-5xl">👤</span>
                        </div>
                      </div>

                      {/* Guest Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-bold rounded-full border border-white/30">
                            Convidado
                          </span>
                          {episodeCount > 0 && (
                            <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-bold rounded-full">
                              {episodeCount} {episodeCount === 1 ? 'EPISÓDIO' : 'EPISÓDIOS'}
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3 line-clamp-1 group-hover:scale-105 transition">
                          {first} {last && <span className="text-white/80">{last}</span>}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                          {/* First Name */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">
                              {first}
                            </span>
                          </div>

                          {/* Last Name */}
                          {last && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-medium">
                                {last}
                              </span>
                            </div>
                          )}

                          {/* Episodes Count */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                            </svg>
                            <span className="text-sm font-medium">
                              {episodeCount} {episodeCount === 1 ? 'episódio' : 'episódios'}
                            </span>
                          </div>

                          {/* Topics */}
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            <span className="text-sm font-medium truncate max-w-xs">
                              {topicsDisplay}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-3">
                        <Link
                          href={`/admin/guests/${guest.id}/edit`}
                          className="px-6 py-3 bg-white/90 hover:bg-white text-purple-600 rounded-lg font-bold transition backdrop-blur-sm shadow-lg"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => deleteGuest(guest.id, guest.name)}
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
