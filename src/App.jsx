import { useState } from 'react'
import HabitList from './components/HabitList.jsx'

const THEME_KEY = 'habit-tracker-theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    // ignore storage errors
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

function App() {
  const [theme, setTheme] = useState(() => {
    const initial = getInitialTheme()
    applyTheme(initial)
    return initial
  })

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      applyTheme(next)
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // ignore storage errors
      }
      return next
    })
  }

  const isDark = theme === 'dark'

  return (
    <div>
      <header className="app-header">
        <div>
          <h1>Habit Tracker</h1>
          <p>Your daily habits, streaks, and weekly targets.</p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={isDark}
        >
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </header>
      <HabitList />
    </div>
  )
}

export default App
