import { useDispatch, useSelector } from 'react-redux'
import { addToWatchlist, removeFromWatchlist, selectIsInWatchlist } from '../redux/uiSlice'
import { selectUser } from '../redux/authSlice'
import toast from 'react-hot-toast'
import { FiBookmark } from 'react-icons/fi'

function WatchlistButton({
  id,
  title,
  posterPath,
  type = 'movie',
  rating,
  overview,
  size = 'md',
  showLabel = false,
}) {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isInWatchlist = useSelector(selectIsInWatchlist(Number(id), type))

  const sizes = {
    sm: { btn: 'px-2 py-1.5', icon: 'w-3.5 h-3.5', text: 'text-xs' },
    md: { btn: 'px-4 py-2.5', icon: 'w-4 h-4', text: 'text-sm' },
    lg: { btn: 'px-6 py-3', icon: 'w-5 h-5', text: 'text-base' },
  }

  const handleToggle = (e) => {
    e.stopPropagation()
    if (!user) {
      toast.error('Please login to use watchlist')
      return
    }
    if (isInWatchlist) {
      dispatch(removeFromWatchlist({ id: Number(id), type }))
      toast.success('Removed from watchlist')
    } else {
      dispatch(addToWatchlist({
        id: Number(id),
        title,
        posterPath,
        type,
        rating,
        overview,
      }))
      toast.success('Added to watchlist!')
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-2 rounded-xl font-medium transition-all duration-200 border
        ${sizes[size].btn} ${sizes[size].text}
        ${isInWatchlist
          ? 'bg-primary-500/20 border-primary-500/50 text-primary-300 hover:bg-primary-500/30'
          : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
        }`}
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <FiBookmark className={`${sizes[size].icon} ${isInWatchlist ? 'fill-primary-400' : ''}`} />
      {showLabel && <span>{isInWatchlist ? 'In Watchlist' : 'Watchlist'}</span>}
    </button>
  )
}

export default WatchlistButton
