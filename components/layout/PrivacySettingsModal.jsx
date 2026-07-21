'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import * as Dialog from '@radix-ui/react-dialog'
import toast from 'react-hot-toast'
import { Download, AlertTriangle, Trash2, X } from 'lucide-react'

export default function PrivacySettingsContent() {
  const { getToken } = useAuth()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    const toastId = toast.loading('Preparing your data...')
    try {
      const token = await getToken()
      const res = await fetch('/api/export-data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!res.ok) {
        throw new Error('Failed to export data')
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'my-hercycle-data.zip'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      toast.success('Data exported successfully!', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('Could not export data. Please try again.', { id: toastId })
    } finally {
      setIsExporting(false)
    }
  }



  return (
    <div className="p-4 sm:p-8 flex flex-col items-center justify-center h-full text-center space-y-10 animate-in fade-in duration-300 mt-8">
      
      {/* Centered Icon & Text */}
      <div className="space-y-5 max-w-md flex flex-col items-center">
        <div className="p-5 bg-white/5 rounded-2xl mb-2 border border-white/10 shadow-xl">
          <Download className="w-10 h-10 text-white/80" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Export Your Data</h1>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed">
            Download a complete archive of your logged cycles, symptoms, and health metrics in an easy-to-read JSON format.
          </p>
        </div>
      </div>

      {/* Centered Action */}
      <div className="pt-2 w-full sm:w-auto">
        <div 
          onClick={!isExporting ? handleExportData : undefined}
          role="button"
          tabIndex={0}
          className={`relative flex items-center justify-center w-full sm:w-auto min-w-[220px] gap-3 bg-[#e8527e] hover:bg-[#d43d68] text-white px-8 py-3.5 rounded-xl transition-all shadow-lg font-medium select-none ${isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]'}`}
        >
          <Download className={`w-5 h-5 transition-transform duration-300 ${isExporting ? 'animate-bounce' : ''}`} />
          <span>{isExporting ? 'Preparing Archive...' : 'Download Data Archive'}</span>
        </div>
      </div>

    </div>
  )
}
