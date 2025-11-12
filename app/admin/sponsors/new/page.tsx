'use client'

import { supabase } from '@/utils/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewSponsorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('sponsors')
        .insert([{
          name: formData.name,
          website: formData.website || null,
          logo_url: formData.logo_url || null,
          contact_email: formData.contact_email || null,
          contact_phone: formData.contact_phone || null,
          geo_targeting: formData.regions.length > 0 ? formData.regions : null,
        }])
        .select()

      if (error) throw error

      alert('Sponsor added successfully! ✅')
      router.push('/admin/sponsors')
    } catch (error: any) {
      alert('Error creating sponsor: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Sponsor</h1>
        <p className="text-gray-600 mt-1">Add a new podcast sponsor</p>
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
          <p className="mt-1 text-sm text-gray-500">
            URL to the sponsor's logo image
          </p>
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
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Sponsor'}
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