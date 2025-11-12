'use client'

import { supabase } from '@/utils/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewEpisodePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [guests, setGuests] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    is_premium: false,
    selectedGuests: [] as string[],
  })

  useEffect(() => {
    fetchGuests()
  }, [])

  async function fetchGuests() {
    const { data } = await supabase
      .from('guests')
      .select('id, name')
      .order('name', { ascending: true })
    
    if (data) {
      setGuests(data)
    }
  }

  const toggleGuest = (guestId: string) => {
    if (formData.selectedGuests.includes(guestId)) {
      setFormData({
        ...formData,
        selectedGuests: formData.selectedGuests.filter(id => id !== guestId)
      })
    } else {
      setFormData({
        ...formData,
        selectedGuests: [...formData.selectedGuests, guestId]
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create episode
      const { data: episode, error: episodeError } = await supabase
        .from('episodes')
        .insert([{
          title: formData.title,
          youtube_url: formData.youtube_url || null,
          description: formData.description || null,
          is_premium: formData.is_premium,
          published_at: new Date().toISOString(),
        }])
        .select()
        .single()

      if (episodeError) throw episodeError

      // Link guests to episode
      if (formData.selectedGuests.length > 0) {
        const guestLinks = formData.selectedGuests.map((guestId, index) => ({
          episode_id: episode.id,
          guest_id: guestId,
          appearance_number: index + 1
        }))

        const { error: linkError } = await supabase
          .from('episode_guests')
          .insert(guestLinks)

        if (linkError) throw linkError
      }

      alert('Episode created successfully! ✅')
      router.push('/admin/episodes')
    } catch (error: any) {
      alert('Error creating episode: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Episode</h1>
        <p className="text-gray-600 mt-1">Add a new podcast episode</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Episode Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter episode title"
          />
        </div>

        {/* YouTube URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube URL
          </label>
          <input
            type="url"
            value={formData.youtube_url}
            onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Paste the full YouTube video URL
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Episode description..."
          />
        </div>

        {/* Guest Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests ({formData.selectedGuests.length} selected)
          </label>
          <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
            {guests.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No guests available. <a href="/admin/guests/new" className="text-blue-600 hover:underline">Add a guest first</a>
              </p>
            ) : (
              <div className="space-y-2">
                {guests.map((guest) => (
                  <label
                    key={guest.id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedGuests.includes(guest.id)}
                      onChange={() => toggleGuest(guest.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{guest.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Select all guests that appear in this episode
          </p>
        </div>

        {/* Premium Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_premium"
            checked={formData.is_premium}
            onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_premium" className="ml-2 text-sm font-medium text-gray-700">
            Premium Content (subscribers only)
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Episode'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}