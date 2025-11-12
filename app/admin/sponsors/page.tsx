'use client'

import { supabase } from '@/utils/supabase'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSponsors()
  }, [])

  async function fetchSponsors() {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching sponsors:', error)
    } else {
      setSponsors(data || [])
    }
    setLoading(false)
  }

  async function deleteSponsor(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Error deleting sponsor: ' + error.message)
    } else {
      alert('Sponsor deleted successfully!')
      fetchSponsors()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading sponsors...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sponsors</h1>
          <p className="text-gray-600 mt-1">{sponsors.length} total sponsors</p>
        </div>
        <Link
          href="/admin/sponsors/new"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          + New Sponsor
        </Link>
      </div>

      {sponsors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">💼</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No sponsors yet</h2>
          <p className="text-gray-600 mb-6">Add your first podcast sponsor</p>
          <Link
            href="/admin/sponsors/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Add First Sponsor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {sponsor.name}
                  </h3>
                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {sponsor.website}
                    </a>
                  )}
                </div>
                <div className="text-3xl ml-2">💼</div>
              </div>

              {sponsor.contact_email && (
                <p className="text-sm text-gray-600 mb-2 break-all">
                  📧 {sponsor.contact_email}
                </p>
              )}

              {sponsor.contact_phone && (
                <p className="text-sm text-gray-600 mb-4">
                  📞 {sponsor.contact_phone}
                </p>
              )}

              {sponsor.geo_targeting && sponsor.geo_targeting.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Targeting:</p>
                  <div className="flex flex-wrap gap-1">
                    {sponsor.geo_targeting.map((region: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                      >
                        📍 {region}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Link
                  href={`/admin/sponsors/${sponsor.id}/edit`}
                  className="flex-1 text-center py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition text-sm font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteSponsor(sponsor.id, sponsor.name)}
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