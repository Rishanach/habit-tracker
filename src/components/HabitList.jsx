import { useEffect, useState } from 'react'
import HabitCard from './HabitCard.jsx'
import MonthlySummary from './MonthlySummary.jsx'
import { fetchHabits } from '../data/habits.js'
import { markHabitDone, resetHabitWeek } from '../utils/habitStats.js'

function HabitList() {
  const [habits, setHabits] = useState([])
  const [sortAz, setSortAz] = useState(false)

  useEffect(() => {
    fetchHabits().then(setHabits)
  }, [])

  function handleMarkDone(habitId) {
    setHabits((prev) => markHabitDone(prev, habitId))
  }

  function handleTogglePinned(habitId) {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, pinned: !habit.pinned } : habit
      )
    )
  }

  function handleResetWeek(habitId) {
    setHabits((prev) => resetHabitWeek(prev, habitId))
  }

  function handleDelete(habitId) {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId))
  }

  const visibleHabits = sortAz
    ? [...habits].sort((a, b) => a.name.localeCompare(b.name))
    : habits

  return (
<<<<<<< Updated upstream
    <div className="habit-dashboard">
      <MonthlySummary habits={habits} />
      <section className="habit-section" aria-labelledby="habits-heading">
        <div className="habit-list-toolbar">
          <div className="habit-list-heading">
            <h2 id="habits-heading">Habits</h2>
            <p>{sortAz ? 'Alphabetical order' : 'Original order'}</p>
          </div>
          <button type="button" className="sort-button" onClick={() => setSortAz((prev) => !prev)}>
            {sortAz ? 'Original order' : 'Sort A–Z'}
          </button>
        </div>
        <div className="habit-grid">
          {visibleHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onMarkDone={handleMarkDone}
              onTogglePinned={handleTogglePinned}
              onResetWeek={handleResetWeek}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
=======
    <div className="habit-board">
      <MonthlySummary habits={habits} />
      <div className="habit-list-toolbar">
        <button type="button" onClick={() => setSortAz((prev) => !prev)}>
          {sortAz ? 'Original order' : 'Sort A–Z'}
        </button>
      </div>
      <div className="habit-list">
      {visibleHabits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onMarkDone={handleMarkDone}
          onTogglePinned={handleTogglePinned}
          onResetWeek={handleResetWeek}
          onDelete={handleDelete}
        />
      ))}
      </div>
>>>>>>> Stashed changes
    </div>
  )
}

export default HabitList
