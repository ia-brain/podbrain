'use client'

import { supabase } from '@/utils/supabase'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditEpisodePage() {
  const router = useRouter()
  const params = useParams()
  const episodeId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    youtube_url: '',
    description: '',
    is_premium: false,
  })

  useEffect(() => {
    fetchEpisode()
  }, [])

  async function fetchEpisode() {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', episodeId)
      .single()
    
    if (error) {
      alert('Error loading episode: ' + error.message)
      router.push('/admin/episodes')
    } else {
      setFormData({
        title: data.title || '',
        youtube_url: data.youtube_url || '',
        description: data.description || '',
        is_premium: data.is_premium || false,
      })
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('episodes')
        .update(formData)
        .eq('id', episodeId)

      if (error) throw error

      alert('Episode updated successfully! ✅')
      router.push('/admin/episodes')
    } catch (error: any) {
      alert('Error updating episode: ' + error.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading episode...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Episode</h1>
        <p className="text-gray-600 mt-1">Update episode details</p>
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
          {formData.youtube_url && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${extractYouTubeId(formData.youtube_url)}/maxresdefault.jpg`}
                  alt="YouTube thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://img.youtube.com/vi/${extractYouTubeId(formData.youtube_url)}/hqdefault.jpg`
                  }}
                />
              </div>
            </div>
          )}
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
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length} characters
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
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this episode?')) {
                handleDelete()
              }
            }}
            className="ml-auto border border-red-300 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition font-medium"
          >
            Delete Episode
          </button>
        </div>
      </form>
    </div>
  )

  async function handleDelete() {
    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', episodeId)
    
    if (error) {
      alert('Error deleting episode: ' + error.message)
    } else {
      alert('Episode deleted successfully!')
      router.push('/admin/episodes')
    }
  }
}

function extractYouTubeId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : ''
}