'use client'

import { supabase } from '@/utils/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewGuestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    communication_style: '',
    topics: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert comma-separated topics to array
      const topicsArray = formData.topics
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const { data, error } = await supabase
        .from('guests')
        .insert([{
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          bio: formData.bio || null,
          communication_style: formData.communication_style || null,
          topics_of_interest: topicsArray.length > 0 ? topicsArray : null,
        }])
        .select()

      if (error) throw error

      alert('Guest added successfully! ✅')
      router.push('/admin/guests')
    } catch (error: any) {
      alert('Error creating guest: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Guest</h1>
        <p className="text-gray-600 mt-1">Add a new podcast guest</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guest Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+55 11 98765-4321"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about the guest..."
          />
        </div>

        {/* Topics of Interest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topics of Interest
          </label>
          <input
            type="text"
            value={formData.topics}
            onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="AI, Technology, Startups"
          />
          <p className="mt-1 text-sm text-gray-500">
            Separate topics with commas
          </p>
        </div>

        {/* Communication Style */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Communication Style
          </label>
          <select
            value={formData.communication_style}
            onChange={(e) => setFormData({ ...formData, communication_style: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a style...</option>
            <option value="Deep and Focused">Deep and Focused</option>
            <option value="Storyteller">Storyteller</option>
            <option value="Drifts on Thoughts">Drifts on Thoughts</option>
            <option value="Needs Extraction">Needs Extraction (Short Answers)</option>
            <option value="Technical">Technical</option>
            <option value="Casual">Casual</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            How does this guest typically communicate?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Guest'}
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