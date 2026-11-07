export function markHabitDone(habits, habitId) {
  return habits.map((habit) =>
    habit.id === habitId
      ? {
          ...habit,
          streak: habit.streak + 1,
          completedThisWeek: habit.completedThisWeek + 1,
        }
      : habit
  )
}

export function getTotalCompletions(habits) {
  return habits.reduce((total, habit) => total + habit.completedThisWeek, 0)
}

export function getStreakDays(habit) {
  return habit.streak
}

export function getTopStreak(habits) 
{
  return habits.reduce(
    (top, habit) => (habit.streak > (top?.streak ?? -1) ? habit : top),
    null
  )
}
export function setWeeklyTarget(habits, habitId, target) 
{
  return habits.map((habit) =>
    habit.id === habitId
      ? { ...habit, targetPerWeek: target }
      : habit
  )
}

export function resetHabitWeek(habits, habitId) {
  return habits.map((habit) =>
    habit.id === habitId
      ? { ...habit, completedThisWeek: 0 }
      : habit
  )
}
