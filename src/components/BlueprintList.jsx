import React, { useState, useEffect } from 'react'
import { blueprintService } from '../blueprintService'
import Toast from './Toast'

const BlueprintList = ({ onSelectBlueprint, maxDisplay = 2 }) => {
  const [blueprints, setBlueprints] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    loadBlueprints()
  }, [])

  const loadBlueprints = async () => {
    try {
      setLoading(true)
      const data = await blueprintService.getBlueprints()
      setBlueprints(data)
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load blueprints'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    
    if (!window.confirm('Are you sure you want to delete this blueprint?')) {
      return
    }

    try {
      setDeleting(id)
      await blueprintService.deleteBlueprint(id)
      setBlueprints(prev => prev.filter(bp => bp.id !== id))
      setToast({
        type: 'success',
        message: 'Blueprint deleted successfully'
      })
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to delete blueprint'
      })
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading blueprints...</p>
        </div>
      </div>
    )
  }

  if (blueprints.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Saved Blueprints</h3>
          <p className="text-gray-600 text-sm">
            No blueprints saved yet. Create your first blueprint to get started!
          </p>
        </div>
      </div>
    )
  }

  const displayedBlueprints = showAll ? blueprints : blueprints.slice(0, maxDisplay)
  const hasMore = blueprints.length > maxDisplay

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Saved Blueprints</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {displayedBlueprints.map((blueprint) => (
            <div
              key={blueprint.id}
              onClick={() => onSelectBlueprint(blueprint)}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-md overflow-hidden mr-3">
                {blueprint.image_url ? (
                  <img 
                    src={blueprint.image_url} 
                    alt={blueprint.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                  {blueprint.name}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {blueprint.rooms?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    {blueprint.equipment?.length || 0}
                  </span>
                  <span className="text-gray-400">
                    {formatDate(blueprint.updated_at)}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => handleDelete(blueprint.id, e)}
                disabled={deleting === blueprint.id}
                className="ml-3 p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                {deleting === blueprint.id ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2 hover:bg-emerald-50 rounded-md transition-colors"
          >
            {showAll ? `Show Less` : `View All (${blueprints.length - maxDisplay} more)`}
          </button>
        )}
      </div>
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default BlueprintList