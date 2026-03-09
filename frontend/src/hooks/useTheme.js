import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme, selectTheme, setTheme } from '../redux/uiSlice'

function useTheme() {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
    root.setAttribute('data-theme', theme)
  }, [theme])

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (t) => dispatch(setTheme(t)),
  }
}

export default useTheme
