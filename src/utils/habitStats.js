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

function createId(prefix) {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${random}`
}

export function createHabit(habits, fields) {
  return [
    ...habits,
    {
      id: createId('habit'),
      name: fields.name,
      description: fields.description,
      streak: 0,
      targetPerWeek: fields.targetPerWeek,
      completedThisWeek: 0,
      pinned: false,
      categoryId: fields.categoryId,
    },
  ]
}

export function updateHabit(habits, habitId, fields) {
  return habits.map((habit) =>
    habit.id === habitId
      ? {
          ...habit,
          name: fields.name,
          description: fields.description,
          targetPerWeek: fields.targetPerWeek,
          categoryId: fields.categoryId,
        }
      : habit
  )
}
