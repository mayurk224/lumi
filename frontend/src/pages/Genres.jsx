import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMovieGenres, getTVGenres } from '../api/tmdb'
import { FiGrid, FiFilm, FiTv } from 'react-icons/fi'

const GENRE_COLORS = {
  Action: { bg: 'from-red-600/30 to-red-900/50', border: 'border-red-500/30', text: 'text-red-300' },
  Adventure: { bg: 'from-orange-600/30 to-orange-900/50', border: 'border-orange-500/30', text: 'text-orange-300' },
  Animation: { bg: 'from-yellow-600/30 to-yellow-900/50', border: 'border-yellow-500/30', text: 'text-yellow-300' },
  Comedy: { bg: 'from-green-600/30 to-green-900/50', border: 'border-green-500/30', text: 'text-green-300' },
  Crime: { bg: 'from-gray-600/30 to-gray-900/50', border: 'border-gray-500/30', text: 'text-gray-300' },
  Documentary: { bg: 'from-blue-600/30 to-blue-900/50', border: 'border-blue-500/30', text: 'text-blue-300' },
  Drama: { bg: 'from-purple-600/30 to-purple-900/50', border: 'border-purple-500/30', text: 'text-purple-300' },
  Family: { bg: 'from-pink-600/30 to-pink-900/50', border: 'border-pink-500/30', text: 'text-pink-300' },
  Fantasy: { bg: 'from-violet-600/30 to-violet-900/50', border: 'border-violet-500/30', text: 'text-violet-300' },
  History: { bg: 'from-amber-600/30 to-amber-900/50', border: 'border-amber-500/30', text: 'text-amber-300' },
  Horror: { bg: 'from-red-900/30 to-black/50', border: 'border-red-900/50', text: 'text-red-400' },
  Music: { bg: 'from-fuchsia-600/30 to-fuchsia-900/50', border: 'border-fuchsia-500/30', text: 'text-fuchsia-300' },
  Mystery: { bg: 'from-indigo-600/30 to-indigo-900/50', border: 'border-indigo-500/30', text: 'text-indigo-300' },
  Romance: { bg: 'from-rose-600/30 to-rose-900/50', border: 'border-rose-500/30', text: 'text-rose-300' },
  'Science Fiction': { bg: 'from-cyan-600/30 to-cyan-900/50', border: 'border-cyan-500/30', text: 'text-cyan-300' },
  Thriller: { bg: 'from-slate-600/30 to-slate-900/50', border: 'border-slate-500/30', text: 'text-slate-300' },
  War: { bg: 'from-stone-600/30 to-stone-900/50', border: 'border-stone-500/30', text: 'text-stone-300' },
  Western: { bg: 'from-yellow-700/30 to-yellow-950/50', border: 'border-yellow-600/30', text: 'text-yellow-400' },
}

const DEFAULT_COLOR = { bg: 'from-primary-600/30 to-primary-900/50', border: 'border-primary-500/30', text: 'text-primary-300' }

function Genres() {
  const navigate = useNavigate()
  const [movieGenres, setMovieGenres] = useState([])
  const [tvGenres, setTvGenres] = useState([])
  const [activeType, setActiveType] = useState('movie')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchGenres() {
      try {
        const [moviesRes, tvRes] = await Promise.all([getMovieGenres(), getTVGenres()])
        setMovieGenres(moviesRes.data.genres)
        setTvGenres(tvRes.data.genres)
      } catch (err) {
        console.error('Failed to fetch genres:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchGenres()
  }, [])

  const genres = activeType === 'movie' ? movieGenres : tvGenres

  const handleGenreClick = (genre) => {
    if (activeType === 'movie') {
      navigate(`/movies?genre=${genre.id}&genreName=${encodeURIComponent(genre.name)}`)
    } else {
      navigate(`/tv-shows?genre=${genre.id}&genreName=${encodeURIComponent(genre.name)}`)
    }
  }

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header Section */}
      <div className="bg-dark-200/50 border-b border-white/5 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
              <FiGrid className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Browse by Genre</h1>
              <p className="text-gray-400 text-sm">Discover movies and shows by category</p>
            </div>
          </div>

          {/* Type Toggle */}
          <div className="flex items-center bg-dark-300/50 border border-white/10 rounded-xl p-1 w-fit gap-1">
            <button
              onClick={() => setActiveType('movie')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeType === 'movie'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <FiFilm className="w-4 h-4" />
              Movies
            </button>
            <button
              onClick={() => setActiveType('tv')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeType === 'tv'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <FiTv className="w-4 h-4" />
              TV Shows
            </button>
          </div>
        </div>
      </div>

      {/* Genre Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(18)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-24 bg-dark-200 rounded-2xl animate-pulse" />
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map((genre) => {
              const colors = GENRE_COLORS[genre.name] || DEFAULT_COLOR
              return (
                <button
                  key={genre.id}
                  onClick={() => handleGenreClick(genre)}
                  className={`relative overflow-hidden h-24 rounded-2xl border ${colors.border}
                    bg-gradient-to-br ${colors.bg}
                    hover:scale-105 hover:shadow-xl transition-all duration-200 group`}
                >
                  {/* Genre Name */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <span className={`font-bold text-base sm:text-lg text-center leading-tight ${colors.text}`}>
                      {genre.name}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Genres
