import { getTotalCompletions, getTopStreak, getStreakDays } from '../utils/habitStats.js'

function MonthlySummary({ habits }) {
  if (habits.length === 0) {
    return (
      <section className="monthly-summary">
        <h2>Monthly summary</h2>
        <p>No habit data yet.</p>
      </section>
    )
  }

  const totalCompletions = getTotalCompletions(habits)
  const topHabit = getTopStreak(habits)

  return (
    <section className="monthly-summary">
      <h2>Monthly summary</h2>
      <p>Total completions: {totalCompletions}</p>
      <p>
        Highest streak: {topHabit.name} ({getStreakDays(topHabit)} days)
      </p>
    </section>
  )
}

export default MonthlySummary
