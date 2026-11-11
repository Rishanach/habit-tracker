import { getTotalCompletions, getTopStreak, getStreakDays } from '../utils/habitStats.js'

function MonthlySummary({ habits }) {
  if (habits.length === 0) {
    return (
      <section className="monthly-summary" aria-labelledby="monthly-summary-heading">
        <div className="summary-heading">
          <p className="summary-kicker">Overview</p>
          <h2 id="monthly-summary-heading">Monthly summary</h2>
        </div>
        <p className="summary-empty">No habit data yet.</p>
      </section>
    )
  }

  const totalCompletions = getTotalCompletions(habits)
  const topHabit = getTopStreak(habits)

  return (
<<<<<<< Updated upstream
    <section className="monthly-summary" aria-labelledby="monthly-summary-heading">
      <div className="summary-heading">
        <p className="summary-kicker">Overview</p>
        <h2 id="monthly-summary-heading">Monthly summary</h2>
      </div>
      <div className="summary-stats">
        <div className="summary-stat">
          <p className="summary-stat-label">Total completions</p>
          <p className="summary-stat-value">{totalCompletions}</p>
        </div>
        <div className="summary-stat">
          <p className="summary-stat-label">Highest streak</p>
          <p className="summary-stat-value">
            {getStreakDays(topHabit)}
            <span className="summary-stat-unit">days</span>
          </p>
          <p className="summary-stat-detail">{topHabit.name}</p>
        </div>
=======
    <section className="monthly-summary">
      <h2>Monthly summary</h2>
      <div className="summary-facts">
        <p>Total completions: {totalCompletions}</p>
        <p>
          Highest streak: {topHabit.name} ({getStreakDays(topHabit)} days)
        </p>
>>>>>>> Stashed changes
      </div>
    </section>
  )
}

export default MonthlySummary
