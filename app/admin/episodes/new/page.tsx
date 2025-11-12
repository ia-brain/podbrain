'use client'

import { supabase } from '@/utils/supabase'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewEpisodePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [guests, setGuests] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    is_premium: false,
    selectedGuests: [] as string[],
    selectedSponsors: [] as Array<{sponsorId: string, placement: string}>,
  })

  useEffect(() => {
    fetchGuests()
    fetchSponsors()
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

  async function fetchSponsors() {
    const { data } = await supabase
      .from('sponsors')
      .select('id, name')
      .order('name', { ascending: true })
    
    if (data) {
      setSponsors(data)
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

  const addSponsor = (sponsorId: string, placement: string) => {
    // Check if sponsor already added
    if (formData.selectedSponsors.some(s => s.sponsorId === sponsorId)) {
      alert('Sponsor already added!')
      return
    }
    
    setFormData({
      ...formData,
      selectedSponsors: [...formData.selectedSponsors, { sponsorId, placement }]
    })
  }

  const removeSponsor = (sponsorId: string) => {
    setFormData({
      ...formData,
      selectedSponsors: formData.selectedSponsors.filter(s => s.sponsorId !== sponsorId)
    })
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

      // Link sponsors to episode
      if (formData.selectedSponsors.length > 0) {
        const sponsorLinks = formData.selectedSponsors.map(s => ({
          episode_id: episode.id,
          sponsor_id: s.sponsorId,
          placement_type: s.placement
        }))

        const { error: sponsorError } = await supabase
          .from('episode_sponsors')
          .insert(sponsorLinks)

        if (sponsorError) throw sponsorError
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
        </div>

        {/* Sponsor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sponsors ({formData.selectedSponsors.length} selected)
          </label>
          
          {/* Selected Sponsors List */}
          {formData.selectedSponsors.length > 0 && (
            <div className="mb-3 space-y-2">
              {formData.selectedSponsors.map((selectedSponsor) => {
                const sponsor = sponsors.find(s => s.id === selectedSponsor.sponsorId)
                return (
                  <div key={selectedSponsor.sponsorId} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium text-gray-900">{sponsor?.name}</span>
                      <span className="text-sm text-gray-600 ml-2">• {selectedSponsor.placement}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSponsor(selectedSponsor.sponsorId)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Add Sponsor Form */}
          <div className="border border-gray-300 rounded-lg p-4">
            {sponsors.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No sponsors available. <a href="/admin/sponsors/new" className="text-blue-600 hover:underline">Add a sponsor first</a>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  id="sponsor-select"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select sponsor...</option>
                  {sponsors.map((sponsor) => (
                    <option key={sponsor.id} value={sponsor.id}>
                      {sponsor.name}
                    </option>
                  ))}
                </select>
                
                <select
                  id="placement-select"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="banner_top">Banner - Top</option>
                  <option value="banner_mid">Banner - Mid Content</option>
                  <option value="banner_end">Banner - End</option>
                  <option value="video_pause">Video - Pause Screen</option>
                  <option value="full_page">Full Page Takeover</option>
                </select>
                
                <button
                  type="button"
                  onClick={() => {
                    const sponsorSelect = document.getElementById('sponsor-select') as HTMLSelectElement
                    const placementSelect = document.getElementById('placement-select') as HTMLSelectElement
                    
                    if (sponsorSelect.value) {
                      addSponsor(sponsorSelect.value, placementSelect.value)
                      sponsorSelect.value = ''
                    } else {
                      alert('Please select a sponsor')
                    }
                  }}
                  className="md:col-span-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  + Add Sponsor
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Select sponsors and their placement types for this episode
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