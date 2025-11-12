'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminEpisodesPage() {
  const [episodes, setEpisodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEpisodes()
  }, [])

  async function fetchEpisodes() {
    // Fetch episodes with their guests
    const { data: episodesData, error } = await supabase
      .from('episodes')
      .select(`
        *,
        episode_guests (
          guests (
            id,
            name
          )
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
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Error deleting episode: ' + error.message)
    } else {
      alert('Episode deleted successfully!')
      fetchEpisodes()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading episodes...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Episodes</h1>
          <p className="text-gray-600 mt-1">{episodes.length} total episodes</p>
        </div>
        <Link
          href="/admin/episodes/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + New Episode
        </Link>
      </div>

      {episodes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">🎙️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No episodes yet</h2>
          <p className="text-gray-600 mb-6">Get started by creating your first episode</p>
          <Link
            href="/admin/episodes/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create First Episode
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {episodes.map((episode) => {
                const guests = episode.episode_guests?.map((eg: any) => eg.guests).filter(Boolean) || []
                
                return (
                  <tr key={episode.id} className="hover:bg-gray-50">
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
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {guest.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No guests</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {episode.published_at
                          ? new Date(episode.published_at).toLocaleDateString()
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
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/episodes/${episode.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteEpisode(episode.id, episode.title)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}