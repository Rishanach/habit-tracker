import { useEffect, useState } from 'react'
import CategoryFilter from './CategoryFilter.jsx'
import CategoryManager from './CategoryManager.jsx'
import HabitCard from './HabitCard.jsx'
import HabitForm from './HabitForm.jsx'
import MonthlySummary from './MonthlySummary.jsx'
import { fetchCategories } from '../data/categories.js'
import { fetchHabits } from '../data/habits.js'
import { findCategory, filterHabitsByCategory, deleteCustomCategory } from '../utils/categories.js'
import { createHabit, markHabitDone, resetHabitWeek, updateHabit } from '../utils/habitStats.js'

const emptyHabit = {
  name: '',
  description: '',
  targetPerWeek: 3,
  categoryId: 'health',
}

function HabitList() {
  const [habits, setHabits] = useState([])
  const [categories, setCategories] = useState([])
  const [ready, setReady] = useState(false)
  const [sortAz, setSortAz] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [habitForm, setHabitForm] = useState(null)
  const [showCategories, setShowCategories] = useState(false)

  useEffect(() => {
    let ignore = false
    Promise.all([fetchHabits(), fetchCategories()]).then(([loadedHabits, loadedCategories]) => {
      if (ignore) return
      setHabits(loadedHabits)
      setCategories(loadedCategories)
      setReady(true)
    })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (habitForm?.mode !== 'edit') return
    if (!habits.some((habit) => habit.id === habitForm.habitId)) setHabitForm(null)
  }, [habits, habitForm])

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

  function handleSaveHabit(fields) {
    if (habitForm?.mode === 'edit') {
      setHabits((prev) => updateHabit(prev, habitForm.habitId, fields))
    } else {
      setHabits((prev) => createHabit(prev, fields))
    }
    setHabitForm(null)
  }

  function handleAddClick() {
    if (habitForm?.mode === 'create') {
      setHabitForm(null)
      return
    }
    setHabitForm({ mode: 'create' })
  }

  function handleDeleteCategory(categoryId) {
    const category = findCategory(categories, categoryId)
    if (!category || category.builtIn) return

    const affected = habits.filter((habit) => habit.categoryId === categoryId).length
    const preview = deleteCustomCategory(categories, habits, categoryId)
    if (!preview.ok) return
    const fallback = findCategory(categories, preview.fallbackId)
    const message = affected
      ? `Delete "${category.name}"? ${affected} ${affected === 1 ? 'habit' : 'habits'} will move to ${fallback?.name ?? 'no category'}. This cannot be undone.`
      : `Delete "${category.name}"? This cannot be undone.`
    if (!window.confirm(message)) return

    setCategories(preview.categories)
    setHabits(preview.habits)
    if (categoryFilter === categoryId) setCategoryFilter('all')
  }

  const filteredHabits = filterHabitsByCategory(habits, categoryFilter)
  const visibleHabits = sortAz
    ? [...filteredHabits].sort((a, b) => a.name.localeCompare(b.name))
    : filteredHabits
  const activeCategory = findCategory(categories, categoryFilter)
  const editingHabit = habitForm?.mode === 'edit'
    ? habits.find((habit) => habit.id === habitForm.habitId)
    : null
  const orderLabel = sortAz ? 'Alphabetical order' : 'Original order'
  const listLabel = activeCategory ? `${orderLabel} · ${activeCategory.name}` : orderLabel

  return (
    <div className="habit-dashboard">
      <MonthlySummary habits={habits} />
      <section className="habit-section" aria-labelledby="habits-heading">
        <div className="habit-list-toolbar">
          <div className="habit-list-heading">
            <h2 id="habits-heading">Habits</h2>
            <p>{ready ? listLabel : 'Loading habits'}</p>
          </div>
          <div className="habit-list-actions">
            <button
              type="button"
              aria-expanded={showCategories}
              aria-controls="category-manager"
              onClick={() => setShowCategories((prev) => !prev)}
              disabled={!ready}
            >
              {showCategories ? 'Hide categories' : 'Categories'}
            </button>
            <button type="button" className="primary-btn" onClick={handleAddClick} disabled={!ready}>
              {habitForm?.mode === 'create' ? 'Cancel add' : 'Add habit'}
            </button>
            <button type="button" className="sort-button" onClick={() => setSortAz((prev) => !prev)}>
              {sortAz ? 'Original order' : 'Sort A–Z'}
            </button>
          </div>
        </div>

        {ready ? (
          <CategoryFilter
            categories={categories}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
        ) : null}

        {showCategories ? (
          <CategoryManager
            categories={categories}
            habits={habits}
            onChange={setCategories}
            onDelete={handleDeleteCategory}
          />
        ) : null}

        {habitForm?.mode === 'create' ? (
          <HabitForm
            key="create"
            title="Add habit"
            submitLabel="Save habit"
            initialValue={{ ...emptyHabit, categoryId: categories[0]?.id ?? emptyHabit.categoryId }}
            categories={categories}
            preferredCategoryId={categories[0]?.id ?? emptyHabit.categoryId}
            onSave={handleSaveHabit}
            onCancel={() => setHabitForm(null)}
          />
        ) : null}

        {editingHabit ? (
          <HabitForm
            key={editingHabit.id}
            title="Edit habit"
            submitLabel="Save changes"
            initialValue={{
              name: editingHabit.name,
              description: editingHabit.description ?? '',
              targetPerWeek: editingHabit.targetPerWeek,
              categoryId: editingHabit.categoryId,
            }}
            categories={categories}
            preferredCategoryId={editingHabit.categoryId}
            onSave={handleSaveHabit}
            onCancel={() => setHabitForm(null)}
          />
        ) : null}

        {ready && visibleHabits.length === 0 ? (
          <p className="habit-empty">
            {categoryFilter === 'all' ? 'No habits yet. Add one to get started.' : 'No habits in this category.'}
          </p>
        ) : null}

        <div className="habit-grid">
          {visibleHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              category={findCategory(categories, habit.categoryId)}
              onMarkDone={handleMarkDone}
              onTogglePinned={handleTogglePinned}
              onResetWeek={handleResetWeek}
              onDelete={handleDelete}
              onEdit={(habitId) => setHabitForm({ mode: 'edit', habitId })}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HabitList
