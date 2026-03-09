import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectWatchlist, removeFromWatchlist, clearWatchlist } from '../redux/uiSlice'
import { selectUser } from '../redux/authSlice'
import toast from 'react-hot-toast'
import { getPosterUrl } from '../api/tmdb'
import PageHeader from '../components/PageHeader'
import MovieCard from '../components/MovieCard'
import EmptyState from '../components/EmptyState'
import ConfirmDialog from '../components/ConfirmDialog'
import SortFilterBar from '../components/SortFilterBar'
import StatsCard from '../components/StatsCard'
import { FiBookmark, FiFilm, FiTv, FiTrash2, FiCalendar } from 'react-icons/fi'

function Watchlist() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const watchlist = useSelector(selectWatchlist)

  const [sortBy, setSortBy] = useState('newest')
  const [filterType, setFilterType] = useState('all')
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'az', label: 'A → Z' },
    { value: 'za', label: 'Z → A' },
    { value: 'rating', label: 'Highest Rated' },
  ]

  const filteredWatchlist = useMemo(() => {
    let items = [...watchlist]
    if (filterType !== 'all') {
      items = items.filter((w) => w.type === filterType)
    }
    switch (sortBy) {
      case 'newest':
        items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
        break
      case 'oldest':
        items.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))
        break
      case 'az':
        items.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'za':
        items.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'rating':
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        break
    }
    return items
  }, [watchlist, sortBy, filterType])

  // Stats
  const movies = watchlist.filter((w) => w.type === 'movie').length
  const tvShows = watchlist.filter((w) => w.type === 'tv').length
  const avgRating =
    watchlist.length > 0
      ? (watchlist.reduce((sum, w) => sum + (w.rating || 0), 0) / watchlist.length).toFixed(1)
      : 0

  const handleClearAll = () => {
    dispatch(clearWatchlist())
    toast.success('Watchlist cleared')
    setShowConfirmClear(false)
  }

  const handleRemove = (id, type) => {
    dispatch(removeFromWatchlist({ id: Number(id), type }))
    toast.success('Removed from watchlist')
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <ConfirmDialog
        isOpen={showConfirmClear}
        onConfirm={handleClearAll}
        onCancel={() => setShowConfirmClear(false)}
        title="Clear Watchlist"
        message="This will remove all movies and shows from your watchlist."
        confirmLabel="Clear Watchlist"
      />

      <PageHeader
        icon={<FiBookmark className="w-7 h-7" />}
        title="My Watchlist"
        subtitle="Movies and shows you plan to watch"
        count={watchlist.length}
        action={
          watchlist.length > 0 && (
            <div className="flex items-center gap-3">
              {/* Type Filter Pills */}
              <div className="flex items-center bg-dark-300/50 border border-white/10 rounded-xl p-1 gap-1">
                {['all', 'movie', 'tv'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                      ${filterType === t
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-white'
                      }`}
                  >
                    {t === 'all' ? 'All' : t === 'tv' ? 'TV' : 'Movies'}
                  </button>
                ))}
              </div>

              {/* Clear Button */}
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium rounded-xl transition-all"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          )
        }
      />

      {/* Stats */}
      {watchlist.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatsCard icon={<FiFilm className="w-5 h-5" />} label="Movies" value={movies} color="blue" />
            <StatsCard icon={<FiTv className="w-5 h-5" />} label="TV Shows" value={tvShows} color="purple" />
            <StatsCard icon={<FiCalendar className="w-5 h-5" />} label="Avg Rating" value={avgRating} color="yellow" />
          </div>
        </div>
      )}

      {/* Sort Bar */}
      {filteredWatchlist.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <SortFilterBar
            sortOptions={SORT_OPTIONS}
            activeSort={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={filteredWatchlist.length}
            label="titles"
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 pb-16">
        {!user && (
          <EmptyState
            icon={<FiBookmark className="w-10 h-10" />}
            title="Sign in to use Watchlist"
            subtitle="Create an account to save movies and shows you want to watch"
            actionLabel="Sign In"
            onAction={() => navigate('/login')}
          />
        )}

        {user && watchlist.length === 0 && (
          <EmptyState
            icon={<FiBookmark className="w-10 h-10" />}
            title="Your watchlist is empty"
            subtitle="Browse movies and TV shows and add them to your watchlist"
            actionLabel="Browse Movies"
            onAction={() => navigate('/')}
          />
        )}

        {user && watchlist.length > 0 && filteredWatchlist.length === 0 && (
          <EmptyState
            icon={<FiBookmark className="w-10 h-10" />}
            title={`No ${filterType === 'tv' ? 'TV shows' : 'movies'} in watchlist`}
            subtitle="Try switching the filter"
            actionLabel="Show All"
            onAction={() => setFilterType('all')}
          />
        )}

        {user && filteredWatchlist.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 px-4 sm:px-8">
            {filteredWatchlist.map((item) => (
              <div key={`${item.id}-${item.type}`} className="relative group">
                <MovieCard
                  id={item.id}
                  title={item.title}
                  posterPath={item.posterPath}
                  rating={item.rating}
                  type={item.type}
                />
                {/* Remove Button Overlay */}
                <button
                  onClick={() => handleRemove(item.id, item.type)}
                  className="absolute top-2 left-2 z-10 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from watchlist"
                >
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Watchlist
