export const initialHabits = [
  { id: 'h1', name: 'Drink water', description: 'Eight glasses throughout the day.', streak: 4, targetPerWeek: 7, completedThisWeek: 4, pinned: true, categoryId: 'health' },
  { id: 'h2', name: 'Read 10 pages', description: 'Any book, morning or evening.', streak: 12, targetPerWeek: 5, completedThisWeek: 3, pinned: false, categoryId: 'learning' },
  { id: 'h3', name: 'Stretch', description: 'Five minutes after sitting.', streak: 2, targetPerWeek: 3, completedThisWeek: 1, pinned: false, categoryId: 'fitness' },
]

export function fetchHabits() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(initialHabits.map((habit) => ({ ...habit }))), 800)
  })
}
