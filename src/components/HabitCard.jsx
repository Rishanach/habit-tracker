import { useEffect, useRef } from 'react'
import { getStreakDays } from '../utils/habitStats.js'
import { playConfettiBurst } from '../utils/confettiBurst.js'
import './habitConfetti.css'

function HabitCard({ habit, onMarkDone, onTogglePinned, onResetWeek, onDelete }) {
  const isHighStreak = getStreakDays(habit) > 10;
  const metWeeklyTarget = habit.completedThisWeek >= habit.targetPerWeek
  const markDoneRef = useRef(null)
  const stopConfettiRef = useRef(null)

  useEffect(() => {
    return () => {
      stopConfettiRef.current?.()
    }
  }, [])

  function handleMarkDone() {
    stopConfettiRef.current?.()
    stopConfettiRef.current = playConfettiBurst(markDoneRef.current)
    onMarkDone(habit.id)
  }

  function handleResetWeek() {
    if (habit.completedThisWeek === 0) return

    const confirmed = window.confirm(
      `Reset this week's progress for "${habit.name}"? This cannot be undone.`
    )
    if (confirmed) onResetWeek(habit.id)
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${habit.name}"? This cannot be undone.`
    )
    if (confirmed) onDelete(habit.id)
  }

  return (
    <div className="habit-card">
      <h3>{habit.name}</h3>
      {habit.description ? <p className="habit-description">{habit.description}</p> : null}
      <p>Streak: {getStreakDays(habit)} days</p>
      <p>
        {habit.completedThisWeek} / {habit.targetPerWeek} this week
      </p>
      {metWeeklyTarget ? (
        <p className="weekly-target-message" role="status">
          Weekly target reached for {habit.name}.
        </p>
      ) : null}

      <div
        className="habit-controls"
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-between',
          marginTop: '1rem'
        }}
      >
        <button
          type="button"
          className={habit.pinned ? 'pin-button pin-button-on habit-btn' : 'pin-button pin-button-off habit-btn'}
          style={{
            borderRadius: '8px',
            background: '#f2f4fa',
            border: 'none',
            padding: '0.5rem 1.2rem',
            cursor: 'pointer'
          }}
          onClick={() => onTogglePinned(habit.id)}
          aria-pressed={habit.pinned}
        >
          {habit.pinned ? 'Pinned' : 'Pin habit'}
        </button>
        <button
          type="button"
          ref={markDoneRef}
          onClick={handleMarkDone}
          className="habit-btn"
          style={{
            borderRadius: '8px',
            background: '#e6f9ec',
            border: 'none',
            padding: '0.5rem 1.2rem',
            cursor: 'pointer'
          }}
        >
          Mark Done
        </button>
        <button
          type="button"
          onClick={handleResetWeek}
          disabled={habit.completedThisWeek === 0}
          className="habit-btn"
          style={{
            borderRadius: '8px',
            background: '#f4f9fa',
            border: 'none',
            padding: '0.5rem 1.2rem',
            cursor: habit.completedThisWeek === 0 ? 'not-allowed' : 'pointer',
            opacity: habit.completedThisWeek === 0 ? 0.6 : 1
          }}
        >
          Reset This Week
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="habit-btn delete-btn"
          style={{
            borderRadius: '8px',
            background: '#ffe6e6',
            border: 'none',
            color: '#db2828',
            padding: '0.5rem 1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 0 1.5px #db2828 inset'
          }}
        >
          Delete
        </button>
      </div>
 
    </div>
  )
}

export default HabitCard
