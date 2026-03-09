import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { rateMovie, removeRating, selectMovieRating } from '../redux/uiSlice'
import { FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'

function StarRating({ movieId, size = 'md', showCount = true, tmdbRating }) {
  const dispatch = useDispatch()
  const userRating = useSelector(selectMovieRating(movieId))
  const [hoveredStar, setHoveredStar] = useState(0)

  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleRate = (star) => {
    if (userRating === star) {
      dispatch(removeRating(String(movieId)))
      toast.success('Rating removed')
    } else {
      dispatch(rateMovie({ movieId: String(movieId), rating: star }))
      toast.success(`Rated ${star} star${star !== 1 ? 's' : ''}!`)
    }
  }

  const displayRating = hoveredStar || userRating

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition-transform duration-100 hover:scale-110 focus:outline-none focus-visible:scale-110"
            aria-label={`Rate ${star} stars`}
          >
            <FiStar
              className={`${sizes[size]} transition-colors duration-150
                ${displayRating >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600 hover:text-yellow-300'
                }`}
            />
          </button>
        ))}

        {showCount && userRating > 0 && (
          <span className="text-gray-400 text-xs ml-1">Your rating: {userRating}/5</span>
        )}

        {!userRating && !hoveredStar && (
          <span className="text-gray-600 text-xs ml-1">Rate this</span>
        )}
      </div>

      {tmdbRating && userRating > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>TMDB: {tmdbRating.toFixed(1)}/10</span>
          <span>·</span>
          <span>Your score: {(userRating * 2).toFixed(0)}/10</span>
        </div>
      )}
    </div>
  )
}

export default StarRating
