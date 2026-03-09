import useTheme from '../hooks/useTheme'
import { FiSun, FiMoon } from 'react-icons/fi'

function ThemeToggle({ size = 'md', showLabel = false }) {
  const { isDark, toggleTheme } = useTheme()

  const sizes = {
    sm: { btn: 'w-8 h-8', icon: 'w-3.5 h-3.5' },
    md: { btn: 'w-10 h-10', icon: 'w-4 h-4' },
    lg: { btn: 'w-12 h-12', icon: 'w-5 h-5' },
  }

  return (
    <button
      onClick={toggleTheme}
      className={`${sizes[size].btn} relative flex items-center justify-center rounded-xl border transition-all duration-300
        ${isDark
          ? 'bg-dark-300/50 border-white/10 text-yellow-400 hover:bg-dark-300 hover:border-yellow-400/30'
          : 'bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100'
        }`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
    >
      <span className={`transition-all duration-300 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
        {isDark ? (
          <FiMoon className={sizes[size].icon} />
        ) : (
          <FiSun className={sizes[size].icon} />
        )}
      </span>

      {showLabel && (
        <span className="ml-2 text-sm font-medium">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  )
}

export default ThemeToggle
