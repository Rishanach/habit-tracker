export const PERSONAL_CATEGORY_ID = 'personal'

export const defaultCategories = [
  { id: 'health', name: 'Health', color: '#1a7f4b', builtIn: true },
  { id: 'fitness', name: 'Fitness', color: '#e07a3d', builtIn: true },
  { id: 'learning', name: 'Learning', color: '#2563eb', builtIn: true },
  { id: 'productivity', name: 'Productivity', color: '#7c3aed', builtIn: true },
  { id: 'personal', name: 'Personal', color: '#db2777', builtIn: true },
]

export function fetchCategories() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(defaultCategories.map((category) => ({ ...category }))), 800)
  })
}
