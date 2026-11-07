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
    <div>
      <MonthlySummary habits={habits} />
      <div className="habit-list-toolbar">
        <button type="button" onClick={() => setSortAz((prev) => !prev)}>
          {sortAz ? 'Original order' : 'Sort A–Z'}
        </button>
      </div>
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
  )
}

export default HabitList
