'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGuests()
  }, [])

  async function fetchGuests() {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching guests:', error)
    } else {
      setGuests(data || [])
    }
    setLoading(false)
  }

  async function deleteGuest(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Error deleting guest: ' + error.message)
    } else {
      alert('Guest deleted successfully!')
      fetchGuests()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading guests...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Guests</h1>
          <p className="text-gray-600 mt-1">{guests.length} total guests</p>
        </div>
        <Link
          href="/admin/guests/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + New Guest
        </Link>
      </div>

      {guests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No guests yet</h2>
          <p className="text-gray-600 mb-6">Add your first podcast guest</p>
          <Link
            href="/admin/guests/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Add First Guest
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guests.map((guest) => (
            <div
              key={guest.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
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
                  <p className="text-xs font-medium text-gray-500 mb-2">Topics:</p>
                  <div className="flex flex-wrap gap-1">
                    {guest.topics_of_interest.slice(0, 3).map((topic: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {guest.topics_of_interest.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{guest.topics_of_interest.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Link
                  href={`/admin/guests/${guest.id}/edit`}
                  className="flex-1 text-center py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition text-sm font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteGuest(guest.id, guest.name)}
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}