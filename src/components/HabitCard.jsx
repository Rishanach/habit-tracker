import { useEffect, useRef, useState } from 'react'
import { getStreakDays } from '../utils/habitStats.js'
import { playConfettiBurst } from '../utils/confettiBurst.js'
import './habitConfetti.css'

function HabitCard({ habit, onMarkDone, onTogglePinned, onResetWeek, onDelete }) {
<<<<<<< Updated upstream
  const streakDays = getStreakDays(habit)
  const isHighStreak = streakDays > 10
=======
>>>>>>> Stashed changes
  const metWeeklyTarget = habit.completedThisWeek >= habit.targetPerWeek
  const weeklyPercent = habit.targetPerWeek > 0
    ? Math.min(100, Math.round((habit.completedThisWeek / habit.targetPerWeek) * 100))
    : 0
  const markDoneRef = useRef(null)
  const stopConfettiRef = useRef(null)
  const [punchedIndex, setPunchedIndex] = useState(null)

  useEffect(() => {
    return () => {
      stopConfettiRef.current?.()
    }
  }, [])

  function handleMarkDone() {
    if (habit.completedThisWeek < habit.targetPerWeek) {
      setPunchedIndex(habit.completedThisWeek)
    }
    stopConfettiRef.current?.()
    stopConfettiRef.current = playConfettiBurst(markDoneRef.current)
    onMarkDone(habit.id)
  }

  function handleResetWeek() {
    if (habit.completedThisWeek === 0) return

    const confirmed = window.confirm(
      `Reset this week's progress for "${habit.name}"? This cannot be undone.`
    )
    if (confirmed) {
      setPunchedIndex(null)
      onResetWeek(habit.id)
    }
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${habit.name}"? This cannot be undone.`
    )
    if (confirmed) onDelete(habit.id)
  }

<<<<<<< Updated upstream
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
        <h3>{habit.name}</h3>
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

=======
  const cells = Array.from({ length: habit.targetPerWeek }, (_, index) => {
    const punched = index < habit.completedThisWeek
    const justPunched = punched && index === punchedIndex
    const className = justPunched
      ? 'cell cell-punched cell-just-punched'
      : punched
        ? 'cell cell-punched'
        : 'cell'

    return <li key={index} className={className} />
  })

  return (
    <article className={habit.pinned ? 'habit-card habit-card-pinned' : 'habit-card'}>
      <div className="habit-card-main">
        <div>
          <div className="habit-title-row">
            <h3>{habit.name}</h3>
            {metWeeklyTarget ? <p className="completed-badge">Completed</p> : null}
          </div>
          {habit.description ? <p className="habit-description">{habit.description}</p> : null}
          <p className="habit-streak">
            Streak: {getStreakDays(habit)} days
          </p>
        </div>

        <div className="habit-progress">
          <ol
            className="blister"
            aria-label={`${habit.completedThisWeek} of ${habit.targetPerWeek} this week`}
          >
            {cells}
          </ol>
          <p className="habit-count">
            {habit.completedThisWeek} / {habit.targetPerWeek} this week
          </p>
          <button
            type="button"
            ref={markDoneRef}
            onClick={handleMarkDone}
            className="mark-done"
          >
            Mark Done
          </button>
          {metWeeklyTarget ? (
            <p className="weekly-target-message" role="status">
              Weekly target reached for {habit.name}.
            </p>
          ) : null}
        </div>
      </div>

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          ref={markDoneRef}
          onClick={handleMarkDone}
          className="habit-btn mark-done-btn"
        >
          Mark Done
        </button>
        <button
          type="button"
=======
>>>>>>> Stashed changes
          onClick={handleResetWeek}
          disabled={habit.completedThisWeek === 0}
          className="habit-btn"
        >
          Reset This Week
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
