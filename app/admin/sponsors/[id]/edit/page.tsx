'use client'

import { supabase } from '@/utils/supabase'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditSponsorPage() {
  const router = useRouter()
  const params = useParams()
  const sponsorId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    logo_url: '',
    contact_email: '',
    contact_phone: '',
    regions: [] as string[],
  })

  const regionOptions = [
    'National',
    'North',
    'Northeast', 
    'Central-West',
    'Southeast',
    'South',
    'Acre',
    'Alagoas',
    'Amapá',
    'Amazonas',
    'Bahia',
    'Ceará',
    'Distrito Federal',
    'Espírito Santo',
    'Goiás',
    'Maranhão',
    'Mato Grosso',
    'Mato Grosso do Sul',
    'Minas Gerais',
    'Pará',
    'Paraíba',
    'Paraná',
    'Pernambuco',
    'Piauí',
    'Rio de Janeiro',
    'Rio Grande do Norte',
    'Rio Grande do Sul',
    'Rondônia',
    'Roraima',
    'Santa Catarina',
    'São Paulo',
    'Sergipe',
    'Tocantins',
  ]

  useEffect(() => {
    fetchSponsor()
  }, [])

  async function fetchSponsor() {
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('id', sponsorId)
      .single()
    
    if (error) {
      alert('Error loading sponsor: ' + error.message)
      router.push('/admin/sponsors')
    } else {
      setFormData({
        name: data.name || '',
        website: data.website || '',
        logo_url: data.logo_url || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        regions: data.geo_targeting || [],
      })
      setLoading(false)
    }
  }

  const toggleRegion = (region: string) => {
    if (formData.regions.includes(region)) {
      setFormData({
        ...formData,
        regions: formData.regions.filter(r => r !== region)
      })
    } else {
      setFormData({
        ...formData,
        regions: [...formData.regions, region]
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('sponsors')
        .update({
          name: formData.name,
          website: formData.website || null,
          logo_url: formData.logo_url || null,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          geo_targeting: formData.regions.length > 0 ? formData.regions : null,
        })
        .eq('id', sponsorId)

      if (error) throw error

      alert('Sponsor updated successfully! ✅')
      router.push('/admin/sponsors')
    } catch (error: any) {
      alert('Error updating sponsor: ' + error.message)
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this sponsor?')) {
      return
    }

    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', sponsorId)
    
    if (error) {
      alert('Error deleting sponsor: ' + error.message)
    } else {
      alert('Sponsor deleted successfully!')
      router.push('/admin/sponsors')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading sponsor...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Sponsor</h1>
        <p className="text-gray-600 mt-1">Update sponsor information</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sponsor Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="TechCorp Brasil"
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://techcorp.com.br"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <input
            type="url"
            value={formData.logo_url}
            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/logo.png"
          />
          {formData.logo_url && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={formData.logo_url}
                alt="Sponsor logo"
                className="h-20 object-contain bg-gray-50 p-2 rounded border"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="contact@techcorp.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+55 11 98765-4321"
            />
          </div>
        </div>

        {/* Geo Targeting */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Geo-Targeting Regions
          </label>
          <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {regionOptions.map((region) => (
                <label
                  key={region}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.regions.includes(region)}
                    onChange={() => toggleRegion(region)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{region}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Selected: {formData.regions.length > 0 ? formData.regions.join(', ') : 'None'}
          </p>
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
            onClick={handleDelete}
            className="ml-auto border border-red-300 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition font-medium"
          >
            Delete Sponsor
          </button>
        </div>
      </form>
    </div>
  )
}