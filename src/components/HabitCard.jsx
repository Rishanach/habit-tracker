import { useEffect, useRef } from 'react'
import { getStreakDays } from '../utils/habitStats.js'
import { playConfettiBurst } from '../utils/confettiBurst.js'
import './habitConfetti.css'

function HabitCard({ habit, category, onMarkDone, onTogglePinned, onResetWeek, onDelete, onEdit }) {
  const streakDays = getStreakDays(habit)
  const isHighStreak = streakDays > 10
  const metWeeklyTarget = habit.completedThisWeek >= habit.targetPerWeek
  const weeklyPercent = habit.targetPerWeek > 0
    ? Math.min(100, Math.round((habit.completedThisWeek / habit.targetPerWeek) * 100))
    : 0
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

  const cardClass = [
    'habit-card',
    habit.pinned ? 'habit-card-pinned' : '',
    isHighStreak ? 'habit-card-strong' : '',
    metWeeklyTarget ? 'habit-card-complete' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClass}>
      <div className="habit-card-top">
        <div className="habit-card-heading">
          <h3>{habit.name}</h3>
          {category ? (
            <p className="habit-category">
              <span className="category-dot" style={{ backgroundColor: category.color }} aria-hidden="true" />
              {category.name}
            </p>
          ) : null}
        </div>
        {habit.pinned ? <span className="habit-chip">Pinned</span> : null}
      </div>
      {habit.description ? <p className="habit-description">{habit.description}</p> : null}

      <div className="habit-metrics">
        <div className="habit-metric">
          <span className="habit-metric-label">Streak</span>
          <span className="habit-metric-value">
            {streakDays}
            <span className="habit-metric-unit">days</span>
          </span>
          {isHighStreak ? <span className="habit-metric-note">Strong streak</span> : null}
        </div>
        <div className="habit-metric">
          <span className="habit-metric-label">This week</span>
          <span className="habit-metric-value">
            {habit.completedThisWeek}
            <span className="habit-metric-unit">/ {habit.targetPerWeek}</span>
          </span>
        </div>
      </div>

      <div
        className="habit-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={habit.targetPerWeek || 0}
        aria-valuenow={Math.min(habit.completedThisWeek, habit.targetPerWeek || 0)}
        aria-label={`${habit.name} weekly progress`}
      >
        <span className="habit-progress-fill" style={{ width: `${weeklyPercent}%` }} />
      </div>

      {metWeeklyTarget ? (
        <p className="weekly-target-message" role="status">
          Weekly target reached for {habit.name}.
        </p>
      ) : null}

      <div className="habit-controls">
        <button
          type="button"
          className={habit.pinned ? 'pin-button pin-button-on habit-btn' : 'pin-button pin-button-off habit-btn'}
          onClick={() => onTogglePinned(habit.id)}
          aria-pressed={habit.pinned}
        >
          {habit.pinned ? 'Pinned' : 'Pin habit'}
        </button>
        <button
          type="button"
          ref={markDoneRef}
          onClick={handleMarkDone}
          className="habit-btn mark-done-btn"
        >
          Mark Done
        </button>
        <button
          type="button"
          onClick={handleResetWeek}
          disabled={habit.completedThisWeek === 0}
          className="habit-btn"
        >
          Reset This Week
        </button>
        <button
          type="button"
          onClick={() => onEdit(habit.id)}
          className="habit-btn"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="habit-btn delete-btn"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default HabitCard
