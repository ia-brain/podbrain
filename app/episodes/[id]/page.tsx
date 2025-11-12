import { supabase } from '@/utils/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Guest {
  id: string
  name: string
  bio: string | null
  topics_of_interest: string[] | null
}

interface Sponsor {
  id: string
  name: string
  logo_url: string | null
}

interface EpisodeGuest {
  guests: Guest
}

interface EpisodeSponsor {
  sponsors: Sponsor
  placement_type: string
}

interface Episode {
  id: string
  title: string
  description: string | null
  youtube_url: string | null
  published_at: string | null
  is_premium: boolean
  episode_guests: EpisodeGuest[]
  episode_sponsors: EpisodeSponsor[]
}

export default async function EpisodePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Fetch episode with all related data
  const { data: episode, error } = await supabase
    .from('episodes')
    .select(`
      *,
      episode_guests (
        guests (
          id,
          name,
          bio,
          topics_of_interest
        )
      ),
      episode_sponsors (
        sponsors (
          id,
          name,
          logo_url
        ),
        placement_type
      )
    `)
    .eq('id', id)
    .single()

  if (error || !episode) {
    notFound()
  }

  const typedEpisode = episode as unknown as Episode

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/episodes" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Episodes
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Episode Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{typedEpisode.title}</h1>
          {typedEpisode.description && (
            <p className="text-lg text-gray-600">{typedEpisode.description}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            {typedEpisode.published_at && (
              <span>{new Date(typedEpisode.published_at).toLocaleDateString()}</span>
            )}
            {typedEpisode.is_premium && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                Premium Content
              </span>
            )}
          </div>
        </div>

        {/* Top Banner Sponsor */}
        {typedEpisode.episode_sponsors?.find(es => es.placement_type === 'banner_top') && (
          <div className="mb-8 bg-gray-100 rounded-lg overflow-hidden">
            {renderSponsorBanner(typedEpisode.episode_sponsors.find(es => es.placement_type === 'banner_top'))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* YouTube Embed */}
            {typedEpisode.youtube_url && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(typedEpisode.youtube_url)}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Mid Banner Sponsor */}
            {typedEpisode.episode_sponsors?.find(es => es.placement_type === 'banner_mid') && (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                {renderSponsorBanner(typedEpisode.episode_sponsors.find(es => es.placement_type === 'banner_mid'))}
              </div>
            )}

            {/* Episode Description */}
            {typedEpisode.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Episode</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {typedEpisode.description}
                </p>
              </div>
            )}

            {/* Premium Content */}
            {typedEpisode.is_premium && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm p-6 border-2 border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">👑</span>
                  <h2 className="text-2xl font-bold text-gray-900">Subscriber Exclusive Content</h2>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">📊 Episode Report</h3>
                    <p className="text-gray-600 text-sm">
                      Get condensed insights and key takeaways from this episode
                    </p>
                    <button className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium">
                      View Report
                    </button>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">🎬 Extended Content</h3>
                    <p className="text-gray-600 text-sm">
                      Watch exclusive extended content and bonus questions
                    </p>
                    <button className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium">
                      Watch Extended Content
                    </button>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">💬 Subscriber Discussion</h3>
                    <p className="text-gray-600 text-sm">
                      Join the exclusive conversation with other subscribers
                    </p>
                    <button className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium">
                      Join Discussion
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* End Banner Sponsor */}
            {typedEpisode.episode_sponsors?.find(es => es.placement_type === 'banner_end') && (
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                {renderSponsorBanner(typedEpisode.episode_sponsors.find(es => es.placement_type === 'banner_end'))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guests */}
            {typedEpisode.episode_guests && typedEpisode.episode_guests.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {typedEpisode.episode_guests.length === 1 ? 'Guest' : 'Guests'}
                </h2>
                <div className="space-y-4">
                  {typedEpisode.episode_guests.map((eg) => (
                    <div key={eg.guests.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {eg.guests.name}
                      </h3>
                      {eg.guests.bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-4">
                          {eg.guests.bio}
                        </p>
                      )}
                      {eg.guests.topics_of_interest && eg.guests.topics_of_interest.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {eg.guests.topics_of_interest.slice(0, 4).map((topic, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsors */}
            {typedEpisode.episode_sponsors && typedEpisode.episode_sponsors.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Sponsored By</h2>
                <div className="space-y-4">
                  {typedEpisode.episode_sponsors
                    .filter(es => es.placement_type === 'full_page' || es.placement_type === 'video_pause')
                    .map((es, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        {es.sponsors.logo_url ? (
                          <img
                            src={es.sponsors.logo_url}
                            alt={es.sponsors.name}
                            className="h-12 object-contain mb-2"
                          />
                        ) : (
                          <p className="font-semibold text-gray-900">{es.sponsors.name}</p>
                        )}
                        <span className="text-xs text-gray-500 capitalize">
                          {es.placement_type.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Enjoying this content?</h2>
              <p className="text-sm text-blue-50 mb-4">
                Subscribe to get exclusive access to premium episodes and bonus content.
              </p>
              <button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
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

function renderSponsorBanner(episodeSponsor: EpisodeSponsor | undefined) {
  if (!episodeSponsor) return null

  return (
    <div className="p-6 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Sponsored By</p>
      {episodeSponsor.sponsors.logo_url ? (
        <img
          src={episodeSponsor.sponsors.logo_url}
          alt={episodeSponsor.sponsors.name}
          className="h-16 mx-auto object-contain"
        />
      ) : (
        <p className="text-xl font-bold text-gray-900">{episodeSponsor.sponsors.name}</p>
      )}
    </div>
  )
}
