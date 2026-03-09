import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectRecentlyViewed, clearRecentlyViewed } from '../redux/uiSlice'
import { getPosterUrl } from '../api/tmdb'
import { FiClock, FiX, FiTrash2, FiChevronRight } from 'react-icons/fi'

function RecentlyViewedDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const recentlyViewed = useSelector(selectRecentlyViewed)

  const handleNavigate = (item) => {
    navigate(`/${item.type}/${item.id}`)
    setIsOpen(false)
  }

  const formatTime = (isoString) => {
    const diff = Date.now() - new Date(isoString).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  return (
    <>
      {/* Trigger Button (fixed right side, halfway down) */}
      {recentlyViewed.length > 0 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-primary-500 hover:bg-primary-600 text-white py-6 px-2 rounded-l-xl shadow-xl transition-all hover:-translate-x-0.5 hover:scale-105"
          title="Recently Viewed"
        >
          <div className="flex flex-col items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span
              className="text-xs font-bold"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Recent
            </span>
            <span className="bg-white text-primary-600 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {Math.min(recentlyViewed.length, 9)}
            </span>
          </div>
        </button>
      )}

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Dark Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-80 h-full bg-dark-200 border-l border-white/10 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4 text-primary-400" />
                <h3 className="text-white font-bold">Recently Viewed</h3>
                <span className="bg-primary-500/20 text-primary-400 text-xs px-2 py-0.5 rounded-full border border-primary-500/30">
                  {recentlyViewed.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    dispatch(clearRecentlyViewed())
                    setIsOpen(false)
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Clear all"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {recentlyViewed.map((item) => (
                <div
                  key={`${item.id}-${item.type}`}
                  onClick={() => handleNavigate(item)}
                  className="flex items-center gap-3 p-2 bg-dark-300/20 hover:bg-dark-300/50 border border-white/5 hover:border-primary-500/30 rounded-xl cursor-pointer transition-all group"
                >
                  {/* Poster */}
                  <div className="w-10 h-14 bg-dark-300/50 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getPosterUrl(item.posterPath)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-poster.svg'
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium line-clamp-2 leading-tight group-hover:text-primary-300 transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="bg-primary-500/20 text-primary-400 text-xs px-1.5 py-0.5 rounded-full">
                        {item.type === 'tv' ? 'TV' : 'Movie'}
                      </span>
                      <span className="text-gray-600 text-xs">{formatTime(item.viewedAt)}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <FiChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary-400 flex-shrink-0 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RecentlyViewedDrawer
