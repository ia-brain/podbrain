'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEpisodes() {
      const { data, error } = await supabase
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
        setError(error.message)
      } else {
        setEpisodes(data || [])
      }
      setLoading(false)
    }
    
    fetchEpisodes()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading episodes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">
          Error loading episodes: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            PodBrain Episodes
          </h1>
          <p className="text-gray-600">
            All episodes • {episodes.length} total
          </p>
        </div>

        {episodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No episodes yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {episodes.map((episode) => {
              const guests = episode.episode_guests?.map((eg: any) => eg.guests).filter(Boolean) || []
              const sponsors = episode.episode_sponsors?.map((es: any) => es.sponsors).filter(Boolean) || []
              
              return (
                <div
                  key={episode.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {episode.youtube_url && (
                    <Link href={`/episodes/${episode.id}`}>
                      <div className="aspect-video bg-gray-200 cursor-pointer hover:opacity-90 transition">
                        <img
                          src={getYouTubeThumbnail(episode.youtube_url)}
                          alt={episode.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget
                            const videoId = extractYouTubeId(episode.youtube_url)
                            if (target.src.includes('maxresdefault')) {
                              target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                            }
                          }}
                        />
                      </div>
                    </Link>
                  )}

                  <div className="p-6">
                    <Link href={`/episodes/${episode.id}`}>
                      <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition cursor-pointer">
                        {episode.title}
                      </h2>
                    </Link>
                    
                    {/* Guest badges */}
                    {guests.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {guests.map((guest: any) => (
                            <span
                              key={guest.id}
                              className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded"
                            >
                              👤 {guest.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sponsor badges */}
                    {sponsors.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Sponsored by:</p>
                        <div className="flex flex-wrap gap-1">
                          {sponsors.map((sponsor: any) => (
                            <span
                              key={sponsor.id}
                              className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded"
                            >
                              💼 {sponsor.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {episode.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {episode.description}
                      </p>
                    )}

                    {episode.published_at && (
                      <p className="text-sm text-gray-500 mb-4">
                        {new Date(episode.published_at).toLocaleDateString()}
                      </p>
                    )}

                    <div className="flex gap-3 flex-wrap items-center">
                      <Link
                        href={`/episodes/${episode.id}`}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        View Episode
                      </Link>
                      {episode.youtube_url && (
                        <a
                          href={episode.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-600 hover:text-red-800 transition font-medium"
                        >
                          YouTube ↗
                        </a>
                      )}
                      {episode.is_premium && (
                        <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg font-medium">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function extractYouTubeId(url: string): string {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}

function getYouTubeThumbnail(url: string): string {
  const videoId = extractYouTubeId(url)
  if (!videoId) return ''
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}